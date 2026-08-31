---
title: 'Japan 2027 — Trip Planner'
slug: 'japan-2027-en'
summary: 'A small, deliberately non-generic app: it plans one specific trip to Japan for two people. Itinerary with overlap detection, expense splitting, offline mode and real-time sync between both travellers.'
role: 'Author'
period: '2026 — present'
status: 'active'
stack: ['Astro', 'TypeScript', 'Drizzle ORM', 'PostgreSQL', 'WebSocket', 'Vitest', 'Playwright', 'Railway']
tags: ['Astro', 'PostgreSQL', 'TypeScript', 'PWA']
lang: 'en'
alternate: 'japan-2027'
order: 4
---

## The problem

Planning a long trip between two people breaks generic tools. A shared spreadsheet handles flights and little else: it doesn't know two activities overlap, doesn't warn you that you're arriving at a museum after closing, doesn't compute what one owes the other, and is useless standing in a station with no signal.

Commercial travel apps solve some of that, but in exchange for forcing everything into their data model and assuming connectivity.

## The solution

A bespoke app for **one specific trip** — Japan, 24 January to 13 February 2027, two travellers. It isn't a product and doesn't try to be: that constraint is exactly what lets it handle well the things a generic product has to leave out.

What it does:

- **Operational itinerary** — per-day timeline with overlap detection, out-of-hours warnings and travel-time estimates between places via Haversine distance.
- **Flights, lodging and transport** — manual entry plus real search through SerpApi and SearchApi.
- **Bookings and reminders** — timed entry, restaurants, check-in and JR Pass, surfaced in a next-steps panel.
- **Budget and expense splitting** — currency conversion, net balance between the two travellers and settle-ups.
- **Reference circuits** — itinerary templates applied as drafts, without overwriting existing entries.
- **Offline mode (PWA)** — installable, with a service worker for offline reading and a printable export.
- **Real time** — what one traveller enters, the other sees without reloading.

## Architecture

| Layer | Technology |
|---|---|
| Frontend | Astro with SSR (`@astrojs/node`), Tailwind CSS |
| Backend | Node.js 20, custom WebSocket |
| Database | PostgreSQL, Drizzle ORM |
| Auth | Static per-user access token |
| Tests | Vitest (unit) + Playwright (smoke e2e) |
| Hosting | Railway (app + Postgres) |

### Real time without extra infrastructure

Sync between the two travellers uses no pub/sub service and no queue. It uses **PostgreSQL `LISTEN`/`NOTIFY`** bridged to a custom WebSocket: when a write touches the database, Postgres notifies, the bridge forwards it, and the other client finds out.

For two users and a database that already exists, standing up Redis or a realtime service would have added a component that can fail in exchange for nothing. The database already knows when something changed — it only needed to be listened to.

### Authentication proportional to the problem

There are two known users. No registration, no passwords, no email verification: each traveller has a static access token. The full identity-management apparatus would have meant more code, more attack surface and more to maintain, for a system whose entire user base fits in one hand.

### Spec-first governance

The project is built with [Spec Kit](https://github.com/github/spec-kit): each feature is documented in `specs/NNN-name/` with its spec, plan and tasks, and architecture decisions with their rationale live in a constitution versioned alongside the code.

## CI

GitHub Actions runs lint, typecheck, build, unit and e2e tests **against an ephemeral Postgres**, so integration tests genuinely exercise the database on every push instead of mocking it.

## Status

In active development, with the trip still ahead. The repository is private.
