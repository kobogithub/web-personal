---
title: "pip Printed ERROR and Exited 0"
slug: "un-solo-interprete-en"
seoTitle: "A local lakehouse with Airflow, DuckDB and Iceberg: the isolation the cloud gives you for free"
description: "A medallion lakehouse running entirely on a laptop. The hard part wasn't compute or storage — it was that five services that never meet in the cloud ended up sharing one Python interpreter."
tags: ["Data Engineering", "Airflow", "dbt", "DuckDB", "Apache Iceberg", "Docker", "Python"]
pubDate: "Sep 04 2026"
updatedDate: "Nov 01 2026"
coverImage: "./cover.png"
lang: "en"
alternate: "un-solo-interprete"
---

# pip Printed ERROR and Exited 0

## The thesis

A lakehouse that runs entirely on your laptop is sold as the cheap version of
one in the cloud. Same layers, same interfaces, no bill. And that's largely
true: compute is enough, storage is enough, the mental model carries over.

What doesn't carry over is the isolation.

In the cloud, the orchestrator and the engine that writes your tables are two
managed services. They run on different machines, in different runtimes, with
different dependency resolvers. They never meet. You didn't design that
isolation — it comes included, which is why it shows up on no diagram.

Bring the stack down to a single machine and the gift ends. And the thing that
manages what's left — `pip` — can violate three declared constraints, print the
word `ERROR` three times, and exit 0.

## The stack

A textbook medallion lakehouse, Bronze → Silver → Gold, with every cloud piece
swapped for a local equivalent that speaks the same protocol:

| Role | In the cloud | Here |
|---|---|---|
| Object storage | S3 / ADLS | RustFS (S3-compatible) |
| Query engine | Spark / Snowflake | DuckDB |
| Table format | Delta / Iceberg | Apache Iceberg |
| Catalog | Glue / Unity | RustFS S3 Tables (Iceberg REST) |
| Orchestration | Managed Airflow | Apache Airflow |
| Transformation | dbt | dbt |

RustFS speaking S3 is what makes the exercise worth doing: the code that reads
and writes has no idea it isn't in the cloud. dbt materializes Silver and Gold
as external parquet straight to object storage —

```sql
{{ config(materialized='external', location='s3://silver/int_ventas_limpias.parquet') }}
```

— and DuckDB loads `httpfs` and points its S3 endpoint at `rustfs:9000`. None of
this is a trick. It's the same configuration you'd use against a real bucket,
with a different URL.

Up to here, everything works exactly as advertised.

## The step that didn't fit

The last increment was publishing the Gold product as an **Iceberg table** in a
REST catalog, to get ACID, time travel and schema evolution. The writer is a
PyIceberg script: it reads the Gold parquet and writes the table.

The design question answers itself. Where does a pipeline step go? In the
orchestrator. That's what Airflow is for: it's the service already running, it
already has the DAG, it already knows when Gold finished.

So, into Airflow's Dockerfile:

```dockerfile
FROM apache/airflow:2.10.4-python3.11
RUN pip install --no-cache-dir "dbt-duckdb>=1.8,<2.0"
RUN pip install --no-cache-dir "pyiceberg[s3fs,pyarrow]>=0.7"   # ← this
```

## What happens when you try

The `apache/airflow:2.10.4-python3.11` image ships this set of versions:

| Package | Airflow ships | After installing PyIceberg |
|---|---|---|
| `pyarrow` | 16.1.0 | **25.0.1** |
| `botocore` | 1.35.36 | **1.43.56** |
| `aiobotocore` | 2.15.2 | **3.9.0** |
| `aiohttp` | 3.10.11 | **3.14.3** |
| `fsspec` | 2024.10.0 | **2026.7.0** |

Nine majors of `pyarrow`. A major of `aiobotocore`, which is what the AWS
provider depends on. `fsspec` jumps two years.

And this is what `pip` says while doing it:

```
ERROR: pip's dependency resolver does not currently take into account all the
packages that are installed. This behaviour is the source of the following
dependency conflicts.
boto3 1.35.36 requires botocore<1.36.0,>=1.35.36, but you have botocore
  1.43.56 which is incompatible.
gcsfs 2024.10.0 requires fsspec==2024.10.0, but you have fsspec 2026.7.0
  which is incompatible.
apache-airflow-providers-http 4.13.3 requires aiohttp<3.11.0,>=3.9.2, but you
  have aiohttp 3.14.3 which is incompatible.
```

Three violated constraints, the word `ERROR` in caps, and:

```
$ echo $?
0
```

Exit 0. Success. A `RUN pip install` in a Dockerfile can't tell this apart from
a clean install: there's no `&&` to fail, no red step, the image builds and
ships.

## Why pip is right

The tempting read is that this is a resolver bug. It isn't. I checked what
Airflow actually declares:

```
apache-airflow-providers-amazon 9.1.0
    botocore>=1.34.90
    aiobotocore[boto3]>=2.13.0
    s3fs>=2023.10.0
apache-airflow 2.10.4
    fsspec>=2023.10.0
    aiobotocore>=2.9.0
```

All **lower** bounds. No upper bound anywhere. `botocore 1.43.56` satisfies
`>=1.34.90`. `aiobotocore 3.9.0` satisfies `>=2.13.0` — even though it's a major
the provider has never seen. Formally, pip resolved correctly. It honored every
constraint the package bothered to write down.

The versions that actually work together aren't in the metadata. They're in the
**constraints file** Airflow publishes separately, per version and per Python.
That file is the real guarantee, and `pip install` doesn't read it unless you
hand it over with `--constraint`.

Which is exactly what an extra `RUN pip install` in an inherited Dockerfile
does not do.

It's the same shape as [the problem I wrote about
yesterday](/en/publicar-no-es-distribuir-en/): the guarantee exists, it's well
built, and it lives in a mechanism nothing on the real path ever exercises.

## The worst part isn't that it breaks

After all that, this still works:

```python
>>> from airflow.providers.amazon.aws.hooks.s3 import S3Hook
>>> # (no error)
```

The import succeeds. Airflow starts. The UI comes up. The DAGs appear.

There is no moment where the system tells you it's broken. What there is, is an
AWS provider running against an `aiobotocore` one major ahead of what it was
tested with, and an HTTP provider against an `aiohttp` four minors past its
declared ceiling. That doesn't blow up at import time. It blows up later, on one
specific call, with a `TypeError` on a signature that changed, in a stack trace
pointing at a library you never deliberately installed.

Failing at startup is a good failure: cheap, immediate, and it tells you what
happened. This is the opposite.

## The fix: stop sharing an interpreter

The Iceberg writer ended up as its own container. A minimal image, no Airflow
inside:

```dockerfile
FROM python:3.11-slim
RUN pip install --no-cache-dir \
      "pyiceberg[s3fs,pyarrow]==0.10.0" \
      "boto3==1.43.117" \
      "duckdb==2.0.0" \
      requests
```

With exact versions. The first version of this container said
`pyiceberg>=0.7`: the same ceiling-less `>=` that had just broken Airflow, now
in my own Dockerfile. Isolating the writer doesn't protect it from itself.

Airflow is still the orchestrator — it triggers the step — but it doesn't
**host** it. The distinction sounds like a nuance and it's what holds the stack
together: every process gets its own dependency space back, which is what the
cloud was handing you for free.

It is, literally, rebuilding by hand the isolation you lost by moving
everything onto one machine. Docker Compose isn't there to make the stack
convenient to start. It's there so the pieces don't touch.

Along the way the same problem showed up in a milder form. With Lakekeeper as
the catalog, DuckDB read it with `ATTACH ... (TYPE iceberg, AUTHORIZATION_TYPE
'none')`: without that parameter it demands OAuth2 against a catalog running on
`localhost` with no identity behind it. The default assumes the managed world.
Today, with the catalog inside RustFS, the `ATTACH` signs with
`AUTHORIZATION_TYPE 'sigv4'` and the same S3 credentials: it turns out there
was someone to authenticate locally after all — just not an OAuth provider.

## Two months later

The stack kept moving, and the changes confirm the thesis from another angle.

**MinIO left the stack.** The community edition was archived in April 2026 and
I replaced it with RustFS. The dbt and DuckDB code never noticed: the endpoint
changed, and so did the name of one environment variable. It's the best proof
that betting on the S3 protocol, not on a product, was the right call.

**The catalog moved into storage.** RustFS ships S3 Tables: an Iceberg REST
catalog embedded in the object store itself. Lakekeeper and its Postgres moved
to a fallback profile, because S3 Tables is still in preview (it doesn't
compact or expire snapshots on its own, and a `DROP TABLE` doesn't delete the
data).

That seems to contradict everything above: I merged two pieces into one. It
doesn't. What you can't share is the **interpreter**, not the machine or the
container. RustFS is a Rust binary without a single Python package inside;
adding the catalog to it gives nobody a dependency that steps on another.
Consolidating services is fine. Consolidating dependency resolvers is what
breaks.

**Airflow moved to the slim image.** The full image ships about 28 providers;
the DAGs use none of them. With `apache/airflow:slim-2.10.4-python3.11` the
image went from 2.5 GB to 1.4 GB and idle RAM from 1.58 GiB to 790 MiB. And
along the way `providers-amazon` and `providers-http` disappeared — exactly the
packages whose constraints PyIceberg was stepping on. The cheapest way not to
break someone else's pin is not to have the package. If a DAG ever needs a
provider, it goes in individually and with `==`.

**Now I know what it weighs.** Measured on a 16 GB Mac: the full stack uses
~1.35 GiB idle and ~2.5 GiB at peak running the DAG and the notebooks. Six GB
allocated to Docker is plenty. "Runs on your laptop" stopped being a promise
and became a number.

## What this says about "a lakehouse on your laptop"

Two things get sold together and are worth separating.

**What a local lakehouse does prove:** the SQL, the transformations, the
medallion model, dbt's tests, the lineage, Iceberg's semantics. All of that
carries over unchanged. That's a lot, and it's why the exercise is worth doing.

**What a local lakehouse proves in excess:** a dependency-coexistence problem
you won't have in production, because there each piece is a service with its
own runtime.

**And what it doesn't prove:** volume, concurrency, real partitioning, cost.

The trap is treating that second group as "local noise" worth nothing. The
opposite is true: it's the part that teaches you fastest where the seams were.
You spend an afternoon working out why the orchestrator can't host a step, and
you come out with a much more concrete idea of what the cloud was giving you
besides machines.

## What I take away

1. **Isolation is a cloud feature, and it's not on the diagram.** Five managed
   services are also five independent dependency resolvers. Collapse them onto
   one machine and that's the first thing you lose.
2. **Exit 0 doesn't mean it went well.** `pip` prints `ERROR` and exits
   successfully. Any `RUN pip install` in an inherited Dockerfile may be
   silently stepping on somebody else's pins.
3. **A `>=` with no ceiling isn't a guarantee, it's an intention.** If the
   version that works lives in a constraints file, the command that installs
   has to read it. Otherwise the guarantee is decorative.
4. **Orchestrating isn't hosting.** The orchestrator triggering a step doesn't
   require the step to run inside its interpreter. Splitting them costs one
   container and avoids an entire class of problem.
5. **Prefer the loud failure.** An import that still works after three
   constraints were violated is worse than a crash: it leaves you believing
   you're standing on something that's no longer there.

None of this is about Airflow or PyIceberg. It's about how bringing an
architecture down to a single machine doesn't simplify it — it changes its
topology. And the things the cloud was solving without telling you become
yours, starting with the ones you never knew existed.
