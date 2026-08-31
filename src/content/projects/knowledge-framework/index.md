---
title: 'Knowledge Framework (kn)'
slug: 'knowledge-framework'
summary: 'CLI en Rust que resuelve el cold start problem del desarrollo asistido por IA: deja un proyecto listo para trabajar con agentes en segundos, en vez de una tarde de configuración manual.'
role: 'Autor y mantenedor'
period: '2026 — presente'
status: 'activo'
stack: ['Rust', 'clap', 'reqwest', 'serde', 'TOML', 'Spec Kit', 'MCP']
tags: ['Rust', 'AI', 'CLI', 'MCP', 'Open Source']
repoUrl: 'https://github.com/kobogithub/knowledge'
lang: 'es'
alternate: 'knowledge-framework-en'
order: 1
---

## El problema

Cada vez que arrancás un proyecto nuevo con agentes de IA, repetís el mismo ritual: definir roles y flujos de trabajo, configurar el tracking de issues, instalar las skills que el proyecto va a necesitar, levantar los servidores MCP para que los agentes tengan documentación a mano, y armar las plantillas de planificación.

Es media jornada de trabajo que no aporta nada al producto, y que se hace ligeramente distinta cada vez. El resultado es que cada repositorio termina con su propia convención, y lo que aprendiste en uno no se traslada al siguiente.

Eso es el **cold start problem** del desarrollo asistido por IA: el costo fijo de arranque es tan alto que desalienta usar agentes en proyectos chicos, que es justamente donde más rinden.

## La solución

`kn` es un CLI que automatiza ese arranque. Un comando deja el proyecto con agentes, skills, memoria, plantillas de issues y servidores MCP configurados, siguiendo una convención única.

```bash
kn init mi-proyecto --stack rust
```

La decisión de diseño central es que **el framework no opina sobre qué modelo usás**. Los agentes se declaran en Markdown con frontmatter YAML; el CLI los instala y los cablea, pero no se acopla a ningún proveedor. Eso permite mover un proyecto entre asistentes sin reescribir su configuración.

## Arquitectura

El CLI está escrito en Rust y organizado por comando, cada uno en su módulo:

```
cli/src/
├── main.rs
└── commands/
    ├── init.rs      # inicialización del proyecto
    ├── skills.rs    # gestión de skills
    ├── agents.rs    # gestión de agentes
    ├── beads.rs     # plantillas de issues
    ├── mcp.rs       # servidores MCP
    ├── doctor.rs    # verificación de dependencias
    ├── sync.rs      # sincronización del proyecto
    └── update.rs    # auto-actualización
```

Alrededor del binario viven los artefactos que instala:

- **9 agentes especializados** — planner, frontend, backend, rust, devops, qa, security, uiux-tester y finanzas. Cada uno es un `AGENTS.md` con sus responsabilidades y límites.
- **21 skills** — desde buenas prácticas por lenguaje (Rust, Python, Bash) hasta seguridad (Semgrep, Trivy, Gitleaks, OWASP ZAP).
- **Plantillas de flujo** — formulas para feature, bugfix, spike y release.

La configuración del proyecto vive en un `kn.toml`, y las skills son Markdown con frontmatter YAML: formatos legibles, versionables y editables a mano.

## Gobernanza spec-first

El framework impone un ciclo de trabajo tomado de [Spec Kit](https://github.com/github/spec-kit): **analizar → planificar → especificar → ejecutar → verificar → documentar**. Cada feature vive en `specs/NNN-nombre/` con su spec, su plan y sus tareas.

La regla es que nada se implementa sin una spec aprobada. Suena burocrático para un proyecto personal, pero con agentes cambia el resultado de forma notable: el modelo trabaja mucho mejor contra un documento que fija el alcance que contra un prompt suelto, y la spec queda como registro de por qué se hizo lo que se hizo.

## Distribución

`kn` se distribuye por **Homebrew, `.deb` y `.rpm`**, con instaladores multiplataforma y publicación automatizada en cada release.

Esa parte resultó ser la más laboriosa del proyecto y la peor documentada en la web: armar un tap de Homebrew, empaquetar para Debian, escribir el `.spec` de RPM y automatizar el release completo tiene mucho detalle disperso y poca guía end-to-end.

## Estado

Las fases de core, mejoras y flujo multi-agente están completas. El proyecto es open source bajo licencia MIT y sigue en desarrollo activo.
