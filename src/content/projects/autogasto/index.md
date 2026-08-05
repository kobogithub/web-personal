---
title: 'Autogasto — Bot de Gastos con Visión'
slug: 'autogasto'
summary: 'Registrar un gasto tenía que costar lo mismo que sacarle una foto al ticket. Un bot de Telegram con GPT-4o Vision hace el resto: extrae los datos, los valida y los persiste.'
role: 'Autor'
period: '2026'
status: 'activo'
stack: ['Python', 'FastAPI', 'GPT-4o Vision', 'Supabase', 'PostgreSQL', 'Docker', 'Railway']
tags: ['AI', 'FastAPI', 'Supabase', 'GPT-4o']
lang: 'es'
alternate: 'autogasto-en'
order: 3
---

## El problema

Llevar registro de gastos falla por fricción, no por falta de voluntad. Cualquier sistema que exija abrir una app, elegir categoría y tipear montos se abandona en dos semanas — el esfuerzo por gasto es mayor que el valor percibido de tenerlo anotado.

La conclusión fue invertir el planteo: en vez de mejorar el formulario, eliminarlo. El único gesto aceptable es el que ya hacés igual, sacarle una foto al ticket.

## La solución

Un bot de Telegram al que le mandás la foto y listo. Telegram funciona acá como interfaz porque ya está instalado, ya está autenticado y ya soporta mandar fotos sin fricción: no hay app que instalar ni cuenta que crear.

El flujo completo:

1. El usuario manda la foto del ticket al bot.
2. El bot recibe el webhook, descarga la imagen y se la pasa a la API.
3. La API sube la imagen a Supabase Storage y llama a GPT-4o con el prompt de extracción.
4. GPT-4o devuelve un JSON estructurado con los datos del gasto.
5. Los datos se persisten en la tabla `gastos`.
6. El bot responde con un resumen de lo registrado.

## Arquitectura

<figure class="my-8">
<div class="overflow-x-auto border border-magi-line bg-magi-surface p-4">
<img src="/architecture/autogasto-light.svg" alt="Diagrama de arquitectura de Autogasto: el usuario manda la foto del ticket por Telegram, el webhook la delega a los handlers, que guardan el original en Supabase Storage y piden la extracción al servicio OCR; este llama a GPT-4o Vision con el prompt y el esquema, el JSON resultante lo validan los modelos Pydantic y recién ahí el servicio de gastos lo persiste en PostgreSQL." class="dark:hidden max-w-none m-0" width="1416" height="345" />
<img src="/architecture/autogasto-dark.svg" alt="Diagrama de arquitectura de Autogasto: el usuario manda la foto del ticket por Telegram, el webhook la delega a los handlers, que guardan el original en Supabase Storage y piden la extracción al servicio OCR; este llama a GPT-4o Vision con el prompt y el esquema, el JSON resultante lo validan los modelos Pydantic y recién ahí el servicio de gastos lo persiste en PostgreSQL." class="hidden dark:block max-w-none m-0" width="1416" height="345" />
</div>
<figcaption class="text-xs font-mono text-magi-muted mt-2">Modelado con LikeC4 y exportado con Graphviz. La fuente está en <code>architecture/autogasto/</code>.</figcaption>
</figure>

Backend en FastAPI, organizado por responsabilidad:

```
app/
├── main.py              # app, lifespan, rate limiting
├── config.py            # configuración con pydantic-settings
├── deps.py              # require_api_key (Bearer token)
├── models/              # GastoCreate, GastoResponse, Vehiculo
├── prompts/
│   └── extraccion.py    # system prompt + output schema de GPT-4o
├── routers/
│   ├── gastos.py        # CRUD protegido con API key
│   └── webhook.py       # POST /webhook/telegram
├── services/
│   ├── ocr.py           # llamada a GPT-4o Vision
│   ├── pdf.py           # conversión PDF → imagen
│   ├── storage.py       # upload a Supabase Storage
│   └── gastos.py        # queries a Supabase
└── telegram/
    ├── handlers.py      # lógica del bot
    └── messages.py      # formateo de respuestas
```

### Decisiones que valió la pena tomar

**El prompt es código, no configuración.** Vive en `prompts/extraccion.py` junto con el esquema de salida, versionado con el resto. Un cambio de prompt es un commit revisable, no un ajuste invisible en un panel.

**Esquema de salida explícito.** GPT-4o devuelve JSON estructurado contra un esquema declarado, y los modelos de Pydantic lo validan antes de tocar la base. El modelo puede equivocarse en un monto, pero no puede romper el formato.

**Los tickets en PDF se convierten a imagen** antes del OCR, para que haya un solo camino de extracción en vez de dos ramas que mantener.

**El webhook está separado del CRUD.** `/webhook/telegram` es público por necesidad; `/gastos` va protegido con Bearer token. Que sean routers distintos hace que esa diferencia sea evidente al leer el código.

## Despliegue

Docker sobre Railway, con dominio y TLS automáticos. Las migraciones de Supabase van versionadas en SQL, en orden cronológico, y las dependencias quedan fijadas en un `requirements.lock` generado con `pip-compile`.

## Estado

En uso personal. El repositorio es privado.
