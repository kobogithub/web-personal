---
title: 'Japan 2027 — Planificador de Viaje'
slug: 'japan-2027'
summary: 'Una app chica y deliberadamente no genérica: planifica un viaje concreto a Japón para dos personas. Itinerario con detección de solapamientos, división de gastos, modo offline y sincronización en tiempo real entre los dos viajeros.'
role: 'Autor'
period: '2026 — presente'
status: 'activo'
stack: ['Astro', 'TypeScript', 'Drizzle ORM', 'PostgreSQL', 'WebSocket', 'Vitest', 'Playwright', 'Railway']
tags: ['Astro', 'PostgreSQL', 'TypeScript', 'PWA']
lang: 'es'
alternate: 'japan-2027-en'
order: 4
---

## El problema

Planificar un viaje largo entre dos personas se rompe en las herramientas genéricas. Una hoja de cálculo compartida aguanta los vuelos y poco más: no sabe que dos actividades se pisan, no avisa que llegás a un museo cuando ya cerró, no calcula cuánto le debe uno al otro, y no sirve de nada parado en una estación sin señal.

Las apps de viaje comerciales resuelven algo de eso, pero a cambio de meter todo en su modelo de datos y de asumir conectividad.

## La solución

Una app a medida para **un viaje concreto** — Japón, 24 de enero al 13 de febrero de 2027, dos viajeros. No es un producto y no pretende serlo: esa restricción es lo que permite que resuelva bien cosas que un producto genérico tiene que dejar afuera.

Lo que hace:

- **Itinerario operativo** — línea de tiempo por día con detección de solapamientos, aviso de horarios fuera de apertura y estimación de traslados entre lugares por distancia Haversine.
- **Vuelos, alojamiento y transporte** — carga manual más búsqueda real vía SerpApi y SearchApi.
- **Reservas y recordatorios** — timed-entry, restaurantes, check-in y JR Pass, con avisos en el panel de próximos pasos.
- **Presupuesto y división de gastos** — conversión de moneda, balance neto entre los dos viajeros y liquidaciones.
- **Circuitos de referencia** — plantillas de itinerario aplicables como borrador, sin pisar lo ya cargado.
- **Modo offline (PWA)** — instalable, con service worker para lectura sin conexión y export imprimible.
- **Tiempo real** — lo que carga un viajero lo ve el otro sin recargar.

## Arquitectura

| Capa | Tecnología |
|---|---|
| Frontend | Astro con SSR (`@astrojs/node`), Tailwind CSS |
| Backend | Node.js 20, WebSocket propio |
| Base de datos | PostgreSQL, Drizzle ORM |
| Auth | Token de acceso estático por usuario |
| Tests | Vitest (unitarios) + Playwright (e2e de humo) |
| Hosting | Railway (app + Postgres) |

### Tiempo real sin infraestructura extra

La sincronización entre los dos viajeros no usa un servicio de pub/sub ni una cola. Usa **`LISTEN`/`NOTIFY` de PostgreSQL** con un puente hacia un WebSocket propio: cuando una escritura toca la base, Postgres notifica, el puente lo reenvía y el otro cliente se entera.

Para dos usuarios y una base que ya existe, montar Redis o un servicio de realtime habría sido agregar una pieza que puede fallar a cambio de nada. La base de datos ya sabe cuándo cambió algo — solo hacía falta escucharla.

### Autenticación proporcional al problema

Son dos usuarios conocidos. No hay registro, ni contraseñas, ni verificación por email: cada viajero tiene un token de acceso estático. Todo el aparato de gestión de identidad habría sido más código, más superficie de ataque y más cosas que mantener, para un sistema cuyo universo de usuarios cabe en una mano.

### Gobernanza spec-first

El proyecto está hecho con [Spec Kit](https://github.com/github/spec-kit): cada feature vive documentada en `specs/NNN-nombre/` con su spec, plan y tareas, y las decisiones de arquitectura con sus porqués están en una constitución versionada junto al código.

## CI

GitHub Actions corre lint, typecheck, build, tests unitarios y e2e **contra una Postgres efímera**, así que los tests de integración se ejercitan de verdad en cada push en vez de mockear la base.

## Estado

En desarrollo activo, con el viaje por delante. El repositorio es privado.
