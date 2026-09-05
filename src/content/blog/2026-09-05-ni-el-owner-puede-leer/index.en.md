---
title: "Not Even the Project Owner Can Read That Column"
slug: "ni-el-owner-puede-leer-en"
seoTitle: "A GCP data platform: governance by design with Terraform, Dataform and policy tags"
description: "A Medallion platform on GCP where no rule depends on anyone remembering to follow it. On the distance between documenting a constraint and making the system enforce it."
tags: ["GCP", "Terraform", "Dataform", "BigQuery", "Data Governance", "Data Engineering", "Python"]
pubDate: "Sep 05 2026"
coverImage: "./cover.png"
lang: "en"
alternate: "ni-el-owner-puede-leer"
---

# Not Even the Project Owner Can Read That Column

## The thesis

A small or mid-sized organization's data problem is almost never volume. It's
that the business logic lives scattered across scripts inside the BI tool:
unversioned, untested, with no lineage. Four symptoms always show up together:

- Nobody can trace a number on a dashboard back to its origin.
- Failures are silent: a dashboard serves stale data for months without raising
  a single error.
- There's no catalog, no glossary, no owners, and access control over sensitive
  data is the good faith of whoever built the dashboard.
- Ingestion overwrites history and drops rows to badly handled pagination.

All four have the same shape. There's a rule everyone subscribes to, and nothing
that enforces it.

"Bronze is never overwritten" is an agreement. "The dashboard only reads Gold" is
an agreement. "Not everyone gets to see the billing column" is an agreement. An
agreement holds until the Tuesday somebody is in a hurry.

So I built a data platform on GCP — Medallion, Terraform, Dataform — around a
single design question, repeated for every rule I cared about: **who says no, and
what happens when someone tries anyway?**

## The two versions of every rule

| Rule | The discipline version | Who says no |
|---|---|---|
| Bronze is immutable | "the extractor appends" | GCS rejects the `PUT` with a `412` |
| The dashboard only reads Gold | permissions someone set once | The BI service account has no grant on Silver |
| This column is confidential | a comment in the model | BigQuery: `Access Denied on policy tag` |
| Gold never publishes a number that doesn't reconcile | someone checks before the review | Dataform won't build what depends on the failed assertion |
| The documentation is current | goodwill | CI fails the PR |

The middle column is what almost every repo has. The right one is the work.

<figure class="my-8">
<div class="overflow-x-auto border border-magi-line bg-magi-surface p-4">
<img src="/architecture/gcp-data-platform-en-light.svg" alt="Diagram of the GCP data platform in three horizontal bands. At the top, where each rule is written: GitHub Actions running fmt, validate, compile and freshness; Terraform with its 12 modules, which installs the controls and leaves; and the Knowledge Catalog with the taxonomy, policy tags and glossary, created by Terraform. In the middle, who says no and what it returns when it does: “Bronze is immutable” via if_generation_match=0, which returns 412 Precondition Failed; “the docs are current” via generar_diccionario.py --check, which makes the PR fail; “Gold reconciles with Silver” via the grain and total assertions, after which Dataform won't build whatever depended on the failed model; “the column is confidential” via the taxonomy's policy tag, which returns Access Denied on policy tag and isn't inherited even by the project owner; and “consumption enters via Gold”, because the BI service account has no grant on Silver. At the bottom, the path of the data: the sources —a paginated SaaS API and a Google Sheets spreadsheet— feed the Cloud Functions Gen2 ingestion, one per source and none transforming; from there into Bronze on Cloud Storage, raw and append-only with lineage; then Dataform as the single engine, with versioned SQLX and the graph derived from ref(); then Silver and Gold in BigQuery; and finally the access layer with authorized views and RLS, drawn dashed because it is designed and not implemented, up to the BI dashboard. Dashed arrows come down from the top band into the controls —Terraform and the catalog install, Dataform declares and applies— and solid arrows come down from each control to the leg of the path it can stop." class="dark:hidden max-w-none m-0" width="2175" height="350" />
<img src="/architecture/gcp-data-platform-en-dark.svg"  alt="Diagram of the GCP data platform in three horizontal bands. At the top, where each rule is written: GitHub Actions running fmt, validate, compile and freshness; Terraform with its 12 modules, which installs the controls and leaves; and the Knowledge Catalog with the taxonomy, policy tags and glossary, created by Terraform. In the middle, who says no and what it returns when it does: “Bronze is immutable” via if_generation_match=0, which returns 412 Precondition Failed; “the docs are current” via generar_diccionario.py --check, which makes the PR fail; “Gold reconciles with Silver” via the grain and total assertions, after which Dataform won't build whatever depended on the failed model; “the column is confidential” via the taxonomy's policy tag, which returns Access Denied on policy tag and isn't inherited even by the project owner; and “consumption enters via Gold”, because the BI service account has no grant on Silver. At the bottom, the path of the data: the sources —a paginated SaaS API and a Google Sheets spreadsheet— feed the Cloud Functions Gen2 ingestion, one per source and none transforming; from there into Bronze on Cloud Storage, raw and append-only with lineage; then Dataform as the single engine, with versioned SQLX and the graph derived from ref(); then Silver and Gold in BigQuery; and finally the access layer with authorized views and RLS, drawn dashed because it is designed and not implemented, up to the BI dashboard. Dashed arrows come down from the top band into the controls —Terraform and the catalog install, Dataform declares and applies— and solid arrows come down from each control to the leg of the path it can stop." class="hidden dark:block max-w-none m-0" width="2175" height="350" />
</div>
<figcaption class="text-xs font-mono text-magi-muted mt-2">The dashed arrows coming down are the distance between declaring a rule and enforcing it. Modelled with LikeC4 and exported with Graphviz; the source lives in <code>architecture/gcp-data-platform/</code>.</figcaption>
</figure>

## The uncomfortable case: column-level control

There are two mechanisms in GCP that look alike and don't compete. Confusing them
is the most common mistake I've seen.

| | `data_sensitivity` label | Policy tag |
|---|---|---|
| Applies to | the resource (dataset, bucket) | **the column** |
| Good for | inventory, cost attribution, search | **blocking reads** |
| Who applies it | Terraform | Dataform, in the model's `config` |
| If you lack access | you still read everything | `Access Denied on policy tag` |

The label answers *which resources touch sensitive data*. It's an inventory tag:
useful for slicing cost in the billing export and for answering "who owns this"
without reading Terraform. It prevents nothing.

The policy tag answers *who can read this column*, and BigQuery enforces the
answer at query time.

What surprises you the first time is that **a policy tag isn't inherited from
project IAM**. Without an explicit `datacatalog.categoryFineGrainedReader`
binding on that taxonomy level, nobody reads that column. Not even the project
owner.

It looks like an aggressive default and it's the only correct one: access to
sensitive data is granted, not inherited. Which is why the reader map starts
empty:

```hcl
readers_por_nivel = {}   # on purpose
```

A taxonomy born with everyone inside classifies nothing.

The consequence is worth saying out loud before you apply it: **the first time, a
dashboard will break**. A query that used to work starts returning
`Access Denied on policy tag`. That isn't a bug in the module. It's the first
time anyone has to decide whether that service account should see that column —
and leaving it out is a valid answer too.

## The id that doesn't exist until after `apply`

Here's a seam I enjoyed solving.

Terraform **creates** the policy tag. Dataform **applies** it, in the model's
`config`. But the tag id doesn't exist until after `apply`, and it changes per
environment. Writing it into the `.sqlx` would mean the project can't compile in
a fresh environment.

So it travels as a compilation var, from Terraform to Dataform:

```javascript
// dataform/includes/constantes.js
const POLICY_TAGS = {
  restringido:  dataform.projectConfig.vars.policy_tag_restringido  || "",
  confidencial: dataform.projectConfig.vars.policy_tag_confidencial || "",
};

function sensibilidad(nivel) {
  const tag = POLICY_TAGS[nivel];
  if (tag === undefined) {
    throw new Error(`Unknown sensitivity level: ${nivel}`);
  }
  return tag ? [tag] : [];
}
```

And the model names the level, never the id:

```javascript
abono_mensual: {
  description: "Recurring subscription fee, NUMERIC.",
  bigqueryPolicyTags: constantes.sensibilidad("confidencial")
}
```

The detail that matters is the `|| ""`. **Empty is a valid state**: while the
catalog isn't applied, models compile and tag nothing. The temptation is the
opposite — drop in a fake id so it "works locally" — and it's the worst option on
the table, because a non-existent policy tag doesn't fail at compile time. It
fails on the `apply` against BigQuery, and by then it's already merged.

It's the same shape as the problem [I wrote about
yesterday](/en/un-solo-interprete-en/): the error exists from the start, and the
only thing you choose is when it surfaces. A fake id moves it from where it's
annoying to where it hurts.

## Bronze isn't overwritten because storage won't allow it

The anti-pattern that motivates a Bronze layer is `if_exists='replace'`: the
extractor runs, overwrites yesterday, and history stops being reconstructible
without anyone noticing.

The discipline version of the fix is "extractors append."
The version that holds on its own is two barriers for the same rule:

```python
blob.upload_from_string(
    json.dumps({"_lineage": lineage, "records": records}, ensure_ascii=False),
    content_type="application/json",
    if_generation_match=0,
)
```

First, the object name is unique — timestamp plus uuid — so two runs don't
collide. Second, `if_generation_match=0` tells GCS the upload is only valid if
the object **doesn't exist**; if it does, the API returns
`412 Precondition Failed` and the function blows up.

The second looks redundant as long as the first works. The day the name generator
has a bug, the unique name stops being unique, and the precondition is the only
thing standing between "we lost a day of history" and an exception in the logs.
Immutability is guaranteed by storage, not by the discipline of whoever wrote the
extractor.

## The number that doesn't reconcile never reaches the dashboard

`gld_presupuesto_vs_real` aggregates `gld_ingresos_mensuales` by segment. A join
can lie in two ways: filtering too much (you lose rows) or multiplying (you
duplicate them). Both produce a perfectly plausible number on a dashboard, and
neither produces an error.

The assertion compares the two totals, month by month:

```sql
FROM detalle
FULL OUTER JOIN agregado ON detalle.mes = agregado.mes
WHERE ABS(COALESCE(detalle.total, 0) - COALESCE(agregado.total, 0)) > 0.01
```

Two decisions inside those three lines. The comparison is **per month, not
global**, because a global total can match through compensation between two
months with opposite-sign errors. And the `0.01` tolerance is for `NUMERIC`
rounding, not a business margin of error: the day it needs raising, the tolerance
isn't the problem.

What makes it a control rather than a log is what Dataform does when it fails: it
doesn't build what depends on that model. The pipeline stops before Gold instead
of publishing a bad number and posting to a channel nobody reads.

## What gets generated, and what doesn't

The data dictionary comes out of the `config` blocks in the `.sqlx` files.
Describing the same thing twice guarantees one of the two versions is wrong:

```bash
python3 scripts/generar_diccionario.py --check   # fails if it went stale
```

That `--check` runs in CI. If a model changes and nobody regenerated the
dictionary, the PR doesn't pass. Those same descriptions are what Dataform
publishes into BigQuery and what the catalog picks up afterwards: one source,
three destinations.

The business glossary, on the other hand, is written by hand — and that's
correct.

The dictionary describes what the code does; the glossary describes what the
business decided. A column named `ingreso_recurrente` can be perfectly documented
and still leave open whether a paused contract counts. You can't derive that from
the SQL, because the SQL is the *consequence* of the decision, not the decision.

Which is why every term records who signs off on it. A term without an owner is
an opinion, and six months later nobody remembers which one.

That's the limit of the method: automation moves the boundary of what can't go
stale. It doesn't erase it.

## When the convention loses

One case where the rule collided with someone else's limit. The project ID by
convention is `{environment}-{client}-{project}-gcp`. Service account
`account_id`s derive from it, and GCP caps those at 30 characters. They don't
fit.

Two ways out: shorten the convention everywhere, or admit GCP has the last word.
I picked the second, on one condition — whoever hits it shouldn't have to
investigate anything.

```hcl
validation {
  # The longest role is "dataform" (8). 30 - len("-sa-dataform") = 18.
  condition     = length("${var.sa_prefix}-sa-dataform") <= 30
  error_message = "sa_prefix too long: it exceeds the 30 characters GCP allows in an account_id. Set `gcp_project_id_override` in the environment's terraform.tfvars."
}
```

It fails at `plan`, before touching anything, and the message says what to write.
The discipline version of this was a paragraph in `CONVENTIONS.md` explaining the
limit — the one you read the day after you already broke something.

## What isn't there yet

Worth being explicit, because half of what I described above is validated design,
not production:

- The catalog module compiles and validates against the provider, but has
  **never been applied against a real project**. The policy tag that not even the
  owner can read is how it's documented to work, not a war story of mine.
- Bronze doesn't land in BigQuery yet: the connectors drop JSON in GCS and the
  external table or load job is still missing.
- Both connectors are reference implementations, untested against a real API.
- Row-level security and authorized views live in the C4 model, not in Terraform.
- `workflow` and `scheduler` are written and instantiated in no environment.

The day this gets applied against a real project, the part I expect to hurt is
the policy tags. That it hurts is the point: it means somebody was reading a
column we never decided they could read.

## What I'm taking away

1. **A rule that depends on discipline isn't a rule, it's an intention.** The
   useful question isn't "is it documented?" but "what happens if someone does it
   anyway?".
2. **The control worth having is the one that can say no to you.** A policy tag
   the project owner can't step around is worth more than any permission that
   cascades downward.
3. **Choose where the error surfaces.** You never choose whether the error
   exists; only whether it shows up in your environment or on the production
   `apply`. A fake id so it compiles locally is that choice, made badly.
4. **Generate everything you can, and accept what you can't.** Generated
   documentation can't go stale; hand-written documentation can. What the
   business decides isn't in the code, and pretending otherwise produces a
   glossary that lies.
5. **When a convention collides with someone else's limit, don't document the
   limit.** Make the `plan` fail with the message that says what to do.

None of this is specific to GCP. Terraform, Dataform and BigQuery are the
vocabulary; the exercise is going rule by rule and deciding whether it lives in a
document or in a mechanism. Every one you move costs more that day and stops
costing on all the others.
