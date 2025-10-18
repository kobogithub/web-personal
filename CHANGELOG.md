# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-17

### Added

- Sitio web personal completo con Astro, TypeScript y Tailwind CSS
- Sistema de blog con soporte MDX y contenido markdown
- Página de inicio con presentación y últimas publicaciones
- Sección About con información personal
- Sección Projects con showcase de proyectos
- Sección Skills con habilidades técnicas organizadas
- Formulario de contacto funcional con React y validación completa
- Sistema de tags/etiquetas para organización de contenido
- Feed RSS para suscripción a publicaciones
- Soporte completo para modo oscuro/claro
- Componente TableOfContent automático para posts
- Componente AboutTheAuthor en artículos
- Docker multi-stage build con Nginx
- Docker Compose con healthchecks
- GitHub Actions para CI/CD automático a GitHub Pages
- Configuración Nginx optimizada para producción
- UnoCSS para iconografía con @iconify
- Enlaces externos se abren en nueva pestaña automáticamente
- Integración @astrojs/partytown para optimización de scripts
- Sitemap automático
- Diseño responsive completo
- Optimización SEO

### Content

- Post: "Airflow to Oracle" (2024-11-08)
- Post: "Home Manager" (2025-01-05)
- Configuración de proyectos personales
- Lista de habilidades técnicas (SRE, Cloud, DevOps, etc.)

### Infrastructure

- Configuración TypeScript strict mode
- Path aliases para imports (`@src/*`)
- Prettier configurado para código consistente
- Astro check integrado en build
- PNPM como gestor de paquetes (v10.15.1)
- Node.js 20 en pipeline CI/CD
- Despliegue automático en GitHub Pages
- CNAME configurado para dominio personalizado

### Fixed

- Corrección de iconos en componentes
- Ajustes en configuración de Docker Compose
- Optimización de puertos y networking
- Corrección de versión de pnpm en GitHub Actions workflow

[1.0.0]: https://github.com/kobogithub/web-personal/releases/tag/v1.0.0
