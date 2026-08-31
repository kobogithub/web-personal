---
title: "The System Writes 90 %, I Write 10 %"
slug: "sistema-operativo-personal-en"
seoTitle: "A personal operating system: topics, capacity and agents"
description: "My two previous tracking systems died for the same reason. The third one works because the rules stopped living in a document and became commands."
tags: ["Productivity", "CLI", "Python", "Agents", "Claude Code"]
pubDate: "Aug 31 2026"
coverImage: "./cover.png"
lang: "en"
alternate: "sistema-operativo-personal"
---

# The System Writes 90 %, I Write 10 %

## The thesis

A personal tracking system doesn't die from missing features. It dies the day it
asks you to write down something you already knew.

I proved this twice. The first attempt was a `status-logs/` folder in the team
vault: three lines per workstream, every day. It lasted a few weeks. The second
was a calendar connector that never got stable credentials and quietly switched
itself off. Neither failed because of a bug. They failed because keeping them
alive was my job, and that job competes daily against the actual work.

The third attempt — `kobo` — started from a different premise: **the system
writes 90 %, I write 10 %**. Anything that requires me to compose text every day
is doomed, so it doesn't get designed. Whatever the system can derive from
sources that already exist — the calendar, email, the task tracker, meeting notes
— it derives. Whatever needs my judgment, it asks me, and only that.

This post is about what I learned building it. The tool is mine and it's private;
the ideas aren't.

## The diagnosis: a written rule isn't a rule

Before writing a line of code I ran a quantitative analysis of how I actually
worked: 221 agent sessions across 31 repositories over 42 days, ~1,958 prompts,
21,601 tool calls. The conclusion wasn't "I need another tool." It was that three
separate work cycles and four separate memories coexisted, and none of them knew
the others existed.

But the number that stung was a different one. I had written down, months
earlier, a capacity rule — no more than 22 hours per week of declared load. When
I finally measured it, I had **33 hours declared and not a single workstream
parked**.

The rule existed. It was in a document, nicely worded, and I had written it
myself. It was worth nothing, because complying with it meant opening a YAML file
and doing the arithmetic by hand. And doing arithmetic by hand is exactly what
the 90/10 rule says will die.

> A rule with no verb attached isn't a rule. It's an intention.

That's the transferable lesson of the whole project: **the difference between a
policy and a system is that a system won't let you break it by accident**.

## The unit of work was wrong

The second design flaw was older: I was organizing *meetings* and *tasks*.

Both are terrible units. A task has no horizon — you can't tell whether this
lives for three days or seven months. A meeting has no content: it's an event on
a calendar that doesn't tell you which workstream it belongs to. With those two
units you can have a perfectly tidy calendar and still be unable to answer the
only question that matters: *what am I on the hook for, and how much does it
weigh?*

The right unit turned out to be the **topic**: a live workstream, with its own
horizon, that declares how much of the week it takes.

```
TOPIC ──┬── cadence ────────────→ touchpoint ──→ pre-meeting briefing
        ├── weekly_load_h ──────→ capacity (fits or doesn't)
        ├── counterparts ───────→ who owes me what
        └── stakeholders ───────→ who I report this to
```

Everything else hangs off that. A meeting with no topic is a meeting I can't
justify. A task with no topic is work nobody will read as progress. And — this is
the part that matters — if every topic declares its load, the sum is a quantity,
and a quantity can be compared against a ceiling.

## Turning the rule into a command

The budget is 40 weekly hours split into buckets with hard ceilings. The 22 hours
in the rule are the first two: what can actually be committed.

```text
$ kobo capacidad

Presupuesto semanal
───────────────────
  touchpoints      10 h   ████████
  foco             12 h   ██████████
  reactivo          8 h   ███████
  slots_abiertos    6 h   █████
  cierre            4 h   ███
  total            40 h

Carga declarada vs tope
───────────────────────
  Temas activos    19 h / 22 h (86% del tope)
  Margen           3 h para un tema nuevo

Detalle
───────
  4 h   meses      estrategia   Estrategia de gobernanza de datos   ████
  4 h   meses      delivery     Migración de plataforma analítica   ████
  4 h   semanas    delivery     Unificación de tenants              ████
  4 h   continuo   interno      Mentoring del equipo                ████
  3 h   semanas    comercial    Propuesta de analítica embebida     ███
```

> The outputs in this post are real — they come out of the program — but they run
> against a synthetic state: the topics are made up and there isn't a single piece
> of real work data in them. The CLI speaks Spanish, so its output stays in
> Spanish here; translating it would make it something other than real output.

The rule reads: *"I accept a new topic when I can name which one gets parked."*
Turned into a command, it looks like this:

```bash
kobo nuevo "Platform migration" --tipo delivery --horizonte semanas \
     --cadencia semanal --carga 3 --porque "kickoff requested for September"
```

The interesting part isn't what it does when there's room. It's what it does when
there isn't:

```text
  No entra: 19 h asignadas + 4 h = 23 h, y el tope son 22 h.
  La regla es nombrar cuál sale, no meter un poco más.

  Candidatos (los que menos piden atención hoy)
    estrategia-de-gobernanza-de-datos   4 h   Estrategia de gobernanza de datos
    mentoring-del-equipo                4 h   Mentoring del equipo
    propuesta-de-analitica-embebida     3 h   Propuesta de analítica embebida
    migracion-de-plataforma-analitica   4 h   Migración de plataforma analítica
    unificacion-de-tenants              4 h   Unificación de tenants

  Sacá uno (o varios):  --saca <slug> --saca <otro> [--revisar-saca +30d]
  O asumí el exceso:    --igual  (kobo te lo va a seguir diciendo)
```

*"It doesn't fit: 19 h assigned + 4 h = 23 h, and the ceiling is 22 h. The rule is
to name which one leaves, not to cram in a bit more."* **The arithmetic happens
before anything is written**: nothing was created, and it exits with status 1. It
listed the candidates to park and waited. You can resolve both in one step
(`--saca <topic>`) or explicitly absorb the overage (`--igual`) — and in that
case, the fact that you absorbed it gets written down.

That block is, to me, the whole project in twelve lines: a rule that stopped
living in a document and became something that tells me no.

The same principle governs the rest of the lifecycle:

```bash
kobo espera <topic> --revisar +30d --porque "client paused until October"
kobo cerrar <topic> --porque "delivered and accepted"
```

`espera` **requires the date** on which the decision gets revisited. Without that
date the topic isn't parked, it's abandoned — and "abandoned" is a state no
system should let you write without saying its name out loud. `cerrar` lists
what's still open — who owes you something, which tasks are still alive — and
stops until you look at it.

All three append to the topic's history, which is what answers *"why did this end
up like this?"* three months later. That record is most of the system's value and
it costs me nothing, because it's a byproduct of having used the command.

## The asymmetry in practice

The 90 % the system writes isn't magic: it's reading sources that already exist
and arriving at a proposal.

- The **briefing** before a touchpoint generates itself, and carries the *did they
  reply?* column for every declared counterpart plus the email on that topic since
  the last status. I show up with it; I don't assemble it.
- The **timesheet** is derived from the calendar, not from my memory.
- The **per-person report** crosses topics with their stakeholders and assembles,
  in one shot, everything a given person is waiting on from me. I used to do that
  from memory, every time.

My 10 % is the status updates — three lines — and the decisions: what comes in,
what goes out, what gets closed.

A fourth rule holds all of this up: **nothing gets written to the outside without
confirmation**. The time tracker, the task tracker and email are third-party
systems, and a mistake there is seen by someone else. The system proposes;
outgoing messages leave as drafts. Autonomy is for reading and computing, not for
speaking on my behalf.

## The meeting is the most expensive instrument

A third rule came out of the same diagnosis: my problem was never a shortage of
meetings, it was a surplus. So the default is **no**, and you have to justify why
a message won't do.

That's a command too, and it almost always answers the same thing:

```text
$ kobo reunion migracion-de-plataforma-analitica

Migración de plataforma analítica · ¿reunion?
─────────────────────────────────────────────
  NO hace falta reunion
  Por que: no hay bloqueo ni decision pendiente que justifique una reunion
  → kobo brief migracion-de-plataforma-analitica y seguir por escrito
```

*"No meeting needed: there's no blocker or pending decision that justifies one."*
Missing a fact somebody has: message. A single outstanding request, even an
overdue one: message. The topic already has a weekly touchpoint: take it there.
Only three situations unlock a new meeting — two or more counterparts blocked on
the same workstream (sync), a topic that has drifted more than two cadences with
no touchpoint (reframing), or a decision that requires several people.

When it *is* justified, it won't let you put "coordinate" as the objective:

```text
$ kobo reunion migracion-de-plataforma-analitica

  SI amerita reunion  (sincronizacion)
  Por que: 2 contrapartes con pedidos pendientes sobre el mismo tema

  Objetivo     desbloquear los pedidos cruzados y fijar fechas
  Duracion     45 min (si no entra en 30, son dos reuniones distintas)
  Titulo       Delivery - Migración de plataforma analítica - Sincronizacion
  Asistentes   Referente de infraestructura, Arquitecto de la contraparte

  Agenda
     · Referente de infraestructura: la ventana de corte (pendiente hace 34d)
     · Arquitecto de la contraparte: el inventario de jobs (pendiente hace 27d)
     · Fecha comprometida para cada pendiente

  Si la hacés recurrente consume del bucket touchpoints (10 h/semana).
```

The last line is the one that changed my behaviour most: *"if you make it
recurring it consumes from the touchpoints bucket (10 h/week)."* A recurring
meeting isn't an event on a calendar, it's a mortgage against a 10-hour bucket.
Seeing that written at the moment you create it, rather than three months later
when the calendar no longer fits, is the whole difference.

## The agents, and the failure that taught me most

Four scheduled processes run this without anyone invoking them: a cache refresh
every 4 h, briefing generation and an alarm at 9:00 on business days, and a CI
watcher every 30 minutes.

One rule orders them all:

> **Silence has to be as visible as failure.**

An agent that fails is a problem. One that hangs is worse: it returns no exit
code, writes no log, and the scheduler considers it alive. The system looks like
it's working while it hasn't looked at anything in days.

This isn't hypothetical. On August 20th I found out the briefing agent had
**never fired** — with everything showing green. Before that, while testing the
alarm, the secret manager without an interactive terminal spun for 52 seconds
without complaining until I killed it by hand.

Two decisions came out of that, and I now consider them non-negotiable for
anything automated:

1. **Every run leaves a mark**, even when it did nothing. A run log is what turns
   "nothing happened" into two distinguishable states: *it ran and there was
   nothing* vs. *it never ran*. The health check reads that log, not the
   scheduler's status.
2. **Idempotence as a precondition for autonomy.** The timesheet subtracts what's
   already logged: running it twice over the same window duplicates nothing. That
   property isn't implementation tidiness — it is literally what allows an agent
   to do the filing instead of me eyeballing a list.

They also learned to shut up. The agents that ask about commitments involving
other people don't run on weekends or holidays: a commitment still exists on
Monday. The CI watcher runs always, because a red build only matters while you're
still touching that code.

## Two doors to the same thing

The last thing that changed how much I use it wasn't a feature, it was access.
The system has two entrances and both work from any directory:

- the **CLI**, for the terminal;
- an **agent skill**, so that when I'm working in any of the 31 repos and ask
  "what do I have today?", the agent knows where to look without being told.

When state lives in exactly one place and there are two doors into it, there
stops being a "moment when you use the system." That's the difference between a
tool you visit and one that's simply there.

## What I take away

None of this is about Python, or agents, or a CLI. What worked, in order of
importance:

1. **Pick the right unit.** If your unit doesn't declare its weight, your system
   can't tell you no.
2. **Turn every rule into a verb.** If following it requires remembering, it has
   already failed.
3. **Design for the asymmetry.** Ask which part of what you write is derivable
   from something that already exists. It's almost always more than it looks.
4. **Make silence visible.** An automated system that can't distinguish "all
   good" from "I never ran" is lying to you, and it will do it precisely when you
   depend on it.

The system has 99 commits and around 180 tests, and none of them test drawings:
they test that the arithmetic and the rules hold. It's still mine, still
imperfect, and for the first time it survived a month without me having to
remember it existed.

Which was, precisely, the point.
