---
title: 'Autogasto — Vision-based Expense Bot'
slug: 'autogasto-en'
summary: 'Logging an expense had to cost the same as photographing the receipt. A Telegram bot with GPT-4o Vision does the rest: extracts the data, validates it and persists it.'
role: 'Author'
period: '2026'
status: 'active'
stack: ['Python', 'FastAPI', 'GPT-4o Vision', 'Supabase', 'PostgreSQL', 'Docker', 'Railway']
tags: ['AI', 'FastAPI', 'Supabase', 'GPT-4o']
lang: 'en'
alternate: 'autogasto'
order: 3
---

## The problem

Expense tracking fails through friction, not lack of will. Any system that requires opening an app, picking a category and typing amounts gets abandoned within two weeks — the effort per expense exceeds the perceived value of having it recorded.

The conclusion was to invert the framing: instead of improving the form, remove it. The only acceptable gesture is the one you already make anyway — photographing the receipt.

## The solution

A Telegram bot you send the photo to, and that's it. Telegram works as the interface here because it's already installed, already authenticated and already supports sending photos frictionlessly: no app to install, no account to create.

The full flow:

1. The user sends the receipt photo to the bot.
2. The bot receives the webhook, downloads the image and passes it to the API.
3. The API uploads the image to Supabase Storage and calls GPT-4o with the extraction prompt.
4. GPT-4o returns structured JSON with the expense data.
5. The data is persisted to the `gastos` table.
6. The bot replies with a summary of what was recorded.

## Architecture

<figure class="my-8">
<div class="overflow-x-auto border border-magi-line bg-magi-surface p-4">
<img src="/architecture/autogasto-light.svg" alt="Autogasto architecture diagram: the user sends the receipt photo through Telegram, the webhook delegates to the handlers, which store the original in Supabase Storage and request extraction from the OCR service; that calls GPT-4o Vision with the prompt and schema, the resulting JSON is validated by Pydantic models, and only then does the expenses service persist it to PostgreSQL." class="dark:hidden max-w-none m-0" width="1416" height="345" />
<img src="/architecture/autogasto-dark.svg" alt="Autogasto architecture diagram: the user sends the receipt photo through Telegram, the webhook delegates to the handlers, which store the original in Supabase Storage and request extraction from the OCR service; that calls GPT-4o Vision with the prompt and schema, the resulting JSON is validated by Pydantic models, and only then does the expenses service persist it to PostgreSQL." class="hidden dark:block max-w-none m-0" width="1416" height="345" />
</div>
<figcaption class="text-xs font-mono text-magi-muted mt-2">Modelled with LikeC4 and exported with Graphviz. Source lives in <code>architecture/autogasto/</code>.</figcaption>
</figure>

FastAPI backend, organized by responsibility:

```
app/
├── main.py              # app, lifespan, rate limiting
├── config.py            # configuration via pydantic-settings
├── deps.py              # require_api_key (Bearer token)
├── models/              # GastoCreate, GastoResponse, Vehiculo
├── prompts/
│   └── extraccion.py    # GPT-4o system prompt + output schema
├── routers/
│   ├── gastos.py        # CRUD protected with API key
│   └── webhook.py       # POST /webhook/telegram
├── services/
│   ├── ocr.py           # GPT-4o Vision call
│   ├── pdf.py           # PDF → image conversion
│   ├── storage.py       # upload to Supabase Storage
│   └── gastos.py        # Supabase queries
└── telegram/
    ├── handlers.py      # bot logic
    └── messages.py      # response formatting
```

### Decisions worth making

**The prompt is code, not configuration.** It lives in `prompts/extraccion.py` alongside the output schema, versioned with everything else. A prompt change is a reviewable commit, not an invisible tweak in a dashboard.

**Explicit output schema.** GPT-4o returns structured JSON against a declared schema, and Pydantic models validate it before it touches the database. The model can get an amount wrong, but it cannot break the format.

**PDF receipts are converted to images** before OCR, so there is a single extraction path instead of two branches to maintain.

**The webhook is separated from the CRUD.** `/webhook/telegram` is public by necessity; `/gastos` is protected with a Bearer token. Keeping them in distinct routers makes that difference obvious when reading the code.

## Deployment

Docker on Railway, with automatic domain and TLS. Supabase migrations are versioned as SQL in chronological order, and dependencies are pinned in a `requirements.lock` generated with `pip-compile`.

## Status

In personal use. The repository is private.
