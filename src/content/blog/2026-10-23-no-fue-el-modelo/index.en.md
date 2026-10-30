---
title: "It Wasn't the Model That Made the Difference"
slug: "no-fue-el-modelo-en"
seoTitle: "Text-to-SQL with and without a semantic layer: Bedrock, Athena and Glue Data Catalog on grain trading data"
description: "The same business question to three Claude agents over the same database. The one that knows the most SQL fails five out of five; the smallest one, with a semantic layer, gets all five right at a hundredth of the cost."
tags: ["AWS", "Amazon Bedrock", "Athena", "Glue", "Text-to-SQL", "Semantic Layer", "Data Governance", "Python"]
pubDate: "Oct 23 2026"
coverImage: "./cover.png"
lang: "en"
alternate: "no-fue-el-modelo"
---

# It Wasn't the Model That Made the Difference

## The thesis

Text-to-SQL is almost always demoed on the same database: a `customers` table,
an `orders` table, a `total_amount` column. With names like those any model gets
it right, and the demo ends up proving something the customer doesn't need to
know.

A grain trader's database doesn't look like that. It looks like this:
`liq_cab.tip_op`, `liq_det.cod_gra`, `kg_brt`, `kg_mer`, `imp_ret`. It's what a
Glue crawler leaves behind on top of an ERP: six-letter column names, two-letter
codes, and all the meaning in the head of someone in the commercial team.

For the AWS + Taligent event on October 21 I built a demo to answer one
question: with that database, what makes the model get it right? What I wanted
to show —and what the numbers ended up showing— is that it isn't the model.

## The trap is in the data, not in the SQL

The data is synthetic, generated with a fixed seed: settlement headers and
lines, producers, provinces with their commercial zone, and the daily exchange
rate. Five tables. And three questions any sales manager asks on a Monday:

| id | Question | What you need to know to get it right |
|---|---|---|
| q1 | How many net tonnes of soybeans did we originate in the 2024/25 season? | That soybeans is `SJ`. That net is gross minus shrinkage. That origination is only `LP` settlements. That voided ones don't count. That the 2024/25 season runs from April 2025 to March 2026. |
| q2 | Net amount settled in dollars, by zone, in Q3 2026? | That net subtracts withholdings and expenses. That settlements come in pesos and in dollars. That conversion uses that day's exchange rate. |
| q3 | The five producers who sold us the most corn in the 2024/25 season? | Same as q1, as a ranking. |

Nothing in the third column can be inferred from the schema. `tip_op` could
mean anything, and "season" is a business convention, not a calendar one.

This is what the model wrote for q1 seeing only table and column names:

```sql
SELECT SUM(ld.kg_mer) / 1000.0 AS toneladas_netas
FROM liq_det ld
INNER JOIN liq_cab lc ON ld.nro_liq = lc.nro_liq
WHERE lc.fec_liq >= DATE '2024-07-01'
    AND lc.fec_liq < DATE '2025-07-01'
    AND ld.cod_gra LIKE '%SOJ%'
    AND lc.est NOT IN ('ANULADO', 'CANCELADO')
```

It's valid SQL and runs on Athena without an error. And it's wrong in the
`SELECT` and in every line of the `WHERE`: it sums shrinkage instead of net
kilos, makes up the grain code and the status codes, and runs the season from
July to June. It returned `NULL`, which is the best possible outcome: the error
shows.

On q2 the same model returned three tidy figures, one per zone. They were only
the peso settlements: it filtered `cod_mon = 'ARS'` and left out every dollar
one. That number goes into a slide and nobody questions it. **The dangerous
error isn't the query that fails; it's the one that runs.**

## Three agents, the same question

The demo is a local chat that sends the same question to three Claude agents on
Bedrock, in parallel, against the same data in Athena:

| Agent | What it sees | Who writes the SQL |
|---|---|---|
| No layer | Table names, columns and types | The model |
| With catalog | Plus the Glue Data Catalog descriptions and a business glossary | The model |
| With semantic layer | Only metrics and dimensions, with their meaning | The code; the model picks |

The first two have an `ejecutar_sql` tool and can explore the database before
answering. The third one sees no tables at all.

Each answer is compared against a reference SQL and marked right or wrong.
Measured on q3, five runs per agent:

| | No layer | No layer + SQL skill | With catalog | Semantic layer |
|---|---|---|---|---|
| Model | Opus 5.5 | Opus 5.5 | Opus 5.5 | Haiku 5.5 |
| Correct | 0 of 5 | 0 of 5 | 5 of 5 | 5 of 5 |
| Cost of the five | US$ 0.38 | US$ 0.52 | US$ 0.17 | US$ 0.003 |

There are three readings in that table.

**The biggest model, without context, fails all five.** Not four out of five:
all five. It doesn't lack capability; it lacks information that isn't anywhere
in the database.

**The SQL skill fixes nothing and costs more.** It's a block of generic good
practices appended to the prompt:

```text
- Before filtering by a code, type or status, look at its values.
- Before summing a numeric column, look at its distribution and confirm its unit.
- Don't add up values in different currencies or units without converting them first.
```

With that, the agent explores more: it finds out that `tip_op` holds `LP`, `LS`
and `AJ`. What it doesn't find out is that only `LP` is origination, because
that isn't in the data. Exploring doesn't replace knowing, and every
exploratory query costs tokens. The skill teaches *how* to query; what was
missing was *what the data means*.

**The semantic-layer agent uses the smallest model and costs over a hundred
times less than the one that fails.** It has nothing to explore.

## A catalog and a semantic layer are not the same thing

The catalog agent gets it right because it reads, in the Glue description, that
`tip_op = 'LP'` is a primary settlement, and in the glossary that the 2024/25
season starts on April 1, 2025. But it still writes the SQL. Every run is a
fresh interpretation of the glossary; that they agree is a probability, not a
guarantee.

The semantic layer writes the definition once, in SQL:

```yaml
- id: toneladas_originadas
  descripcion: "Toneladas netas compradas a productores (originación)..."
  expresion: "ROUND(SUM(d.kg_brt - d.kg_mer) / 1000.0, 1)"
  filtros: ["c.tip_op = 'LP'"]
```

The agent doesn't write SQL. It has one tool, `consultar_metrica`, whose
parameters are closed lists built from that YAML: which metric, by which
dimension, which grain, which period. The code builds the query with the general
rule (never voided settlements), the joins and the metric's filters. Adding a
metric to the YAML makes it selectable without touching the prompt.

The most important thing about the layer isn't what it computes; it's what it
refuses to compute. The agent's prompt says:

```text
If the question asks for something the layer doesn't define, don't approximate
it with another metric: answer with no rows, saying what needs to be defined.
```

And the code, when it gets a choice that doesn't exist, raises `FueraDeLaCapa`
with the reason instead of filling in the gap. That's why the demo has a fourth
question, gross margin, which the layer leaves undefined on purpose. An agent
that writes SQL can make up a formula; the layer agent says what's missing. In
production, that "I don't know" is worth more than any plausible number.

## The metric defined live

The demo's closing move was defining a metric in front of the audience: ask for
the average price paid per tonne of soybeans, by zone; watch the layer answer
that it isn't defined; paste the definition into `catalogo.yaml` and save —the
chat reloads the layer on its own— and ask again.

The file holding that definition still has this line:

```yaml
# PENDIENTE DE CONFIRMAR (Kevin): solo LP (no AJ), neto de retenciones y gastos, en dólares.
```

("Pending confirmation: primary settlements only, net of withholdings and
expenses, in dollars.") Does the average price include price adjustments? Is it
net of withholdings? In dollars as of which day? Those are three business
decisions, and the model can't make any of them. If it does, the number will be
consistent, it will run, and it will be a model's opinion presented as data.

## One source

Everything comes out of one file, `catalogo.yaml`: tables, columns with their
comments, the glossary, the semantic layer, and the questions with their
reference SQL. Terraform reads it to create the Glue tables with their
descriptions, so what the catalog agent reads is exactly what an analyst would
see in the AWS console. The demo reads it to build the prompts and the layer.
There's no second copy of any definition that can go stale.

The infrastructure is small on purpose: a private, encrypted S3 bucket with the
Parquet files, the Glue database and tables, an Athena workgroup that cuts off
any query scanning more than 1 GB, and a minimal IAM policy for whoever runs the
demo.

## What the demo doesn't prove

Worth being explicit:

- **It's synthetic data, five tables.** A real ERP has hundreds, and the full
  glossary doesn't fit in a prompt. The catalog agent going five for five here
  says nothing about how it does with 400 tables; the semantic layer scales
  better precisely because it doesn't hand the schema to the model.
- **Five runs isn't statistics.** It's enough to show that "got it right once"
  doesn't mean "reliable", which was the point.
- **Opus without a layer sometimes gets q1 right.** That's why the question
  used to show the error live is q3.
- **Costs are estimates** at list price, and cover only the model, not the
  Athena scan.

## What I take away

1. **A query that runs is not a correct query.** The error that matters is the
   plausible one: a total by zone that leaves out half the currencies.
2. **What's missing is semantics, not capability.** Neither a bigger model nor
   a SQL skill solves the fact that nobody wrote down what a season is.
3. **AI doesn't write the catalog.** Data governance does: owners, definitions,
   rules. The Text-to-SQL demo turned out to be a data governance demo.
4. **Closing the answer space is cheaper and more reliable.** The smallest
   model, picking from a list, beat the biggest one writing freely.
5. **An agent that can say "that isn't defined" is a feature, not a failure.**

Text-to-SQL isn't a model problem. It's the same old problem —nobody wrote down
what "net tonne" means— with a new and much faster way of becoming visible.
