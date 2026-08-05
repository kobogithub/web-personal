export interface BilingualText {
  es: string;
  en: string;
}

export interface Project {
  id: string;
  name: BilingualText;
  description: BilingualText;
  /**
   * Omitir cuando el proyecto no tiene una URL pública. La card renderiza
   * entonces un badge "Proyecto interno" en lugar del botón Demo, en vez de
   * un link genérico al perfil que promete algo que no existe.
   */
  demoLink?: string;
  /**
   * Slug de la ficha en la colección `projects` (sin prefijo de idioma). Cuando
   * está presente, la card enlaza a `/projects/<slug>`; cuando no, el proyecto
   * solo existe como card. No todos los proyectos justifican una ficha.
   */
  detailSlug?: string;
  tags?: string[];
  postLink?: string;
  demoLinkRel?: string;
  [key: string]: any;
}

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: {
      es: 'Web Personal',
      en: 'Personal Website',
    },
    description: {
      es: 'Un blog que comparte recursos y tutoriales de desarrollo web',
      en: 'A blog that shares web development resources and tutorials',
    },
    demoLink: 'https://kobouharriet.site',
    tags: ['Site'],
  },
  {
    id: 'proj-2',
    name: {
      es: 'Agentes IA - Procesamiento de Documentos',
      en: 'AI Agents - Document Processing',
    },
    description: {
      es: 'Sistema de agentes de IA que procesa comprobantes y mensajes usando OCR, NLP y LangChain/LangGraph',
      en: 'AI agent system that processes receipts and messages using OCR, NLP and LangChain/LangGraph',
    },
    tags: ['AI', 'LangChain', 'OpenAI'],
  },
  {
    id: 'proj-3',
    name: {
      es: 'Extractor IA de Granos',
      en: 'AI Grain Extractor',
    },
    description: {
      es: 'Procesador inteligente de mensajes de WhatsApp para mesas de granos con NLP y visión por computadora',
      en: 'Intelligent WhatsApp message processor for grain trading desks with NLP and computer vision',
    },
    tags: ['AI', 'NLP', 'FastAPI'],
  },
  {
    // Fusión de las antiguas proj-4 "Knowledge Framework" y proj-5
    // "Knowledge CLI": eran el mismo producto listado dos veces.
    id: 'proj-4',
    name: {
      es: 'Knowledge Framework (kn)',
      en: 'Knowledge Framework (kn)',
    },
    description: {
      es: 'CLI en Rust que resuelve el "cold start problem" del desarrollo asistido por IA: instala agentes, skills, memoria y workflows en cualquier proyecto. Distribuido por Homebrew, .deb y .rpm.',
      en: 'Rust CLI that solves the cold start problem in AI-assisted development: installs agents, skills, memory and workflows in any project. Distributed via Homebrew, .deb and .rpm.',
    },
    demoLink: 'https://github.com/kobogithub/knowledge',
    detailSlug: 'knowledge-framework',
    tags: ['Rust', 'AI', 'CLI', 'MCP'],
  },
  {
    id: 'proj-6',
    name: {
      es: 'Data Lake AWS',
      en: 'AWS Data Lake',
    },
    description: {
      es: 'Arquitectura data lake híbrida con ingesta automatizada y arquitectura medallion',
      en: 'Hybrid data lake architecture with automated ingestion and medallion architecture',
    },
    tags: ['AWS', 'Data', 'Glue'],
  },
  {
    id: 'proj-7',
    name: {
      es: 'Home Manager + Nix',
      en: 'Home Manager + Nix',
    },
    description: {
      es: 'Home Manager: gestión de configuraciones de usuario con Nix.',
      en: 'Home Manager: user configuration management with Nix.',
    },
    demoLink: 'https://github.com/kobogithub/dotfiles-home-manager',
    tags: ['Nix', 'Linux'],
  },

  // Proyectos 2026
  {
    id: 'proj-8',
    name: {
      es: 'Framework de Orquestación de Agentes',
      en: 'Agent Orchestration Framework',
    },
    description: {
      es: 'CLI vendor-agnostic para orquestar equipos de agentes de IA, con arquitectura de cuatro capas (Core/Blueprint/Stack/Plugin), gobernanza spec-first y distribución white-label por cliente.',
      en: 'Vendor-agnostic CLI to orchestrate AI agent teams, with a four-layer architecture (Core/Blueprint/Stack/Plugin), spec-first governance and white-label distribution per client.',
    },
    tags: ['Rust', 'AI', 'Multi-Agent', 'CLI'],
  },
  {
    id: 'proj-9',
    name: {
      es: 'Migración Informatica → ADF + Databricks + Snowflake',
      en: 'Informatica → ADF + Databricks + Snowflake Migration',
    },
    description: {
      es: 'Migración a producción de un pipeline de distribución desde Informatica PowerCenter on-premise hacia Azure Data Factory, Databricks y Snowflake. 19 procesos, go-live julio 2026.',
      en: 'Production migration of a distribution pipeline from on-premise Informatica PowerCenter to Azure Data Factory, Databricks and Snowflake. 19 processes, go-live July 2026.',
    },
    tags: ['Azure', 'Databricks', 'Snowflake', 'Data'],
  },
  {
    id: 'proj-10',
    name: {
      es: 'Lakehouse Medallion on-premise',
      en: 'On-premise Medallion Lakehouse',
    },
    description: {
      es: 'Lakehouse reproducible 100% local con Apache Airflow, MinIO, DuckDB, dbt e Iceberg. Bronze → Silver → Gold con tests y linaje.',
      en: 'Fully local reproducible lakehouse with Apache Airflow, MinIO, DuckDB, dbt and Iceberg. Bronze → Silver → Gold with tests and lineage.',
    },
    detailSlug: 'lakehouse-medallion',
    tags: ['Data', 'dbt', 'DuckDB', 'Airflow'],
  },
  {
    // Repo privado (verificado con la API de GitHub), sin demo pública.
    id: 'proj-11',
    name: {
      es: 'Japan 2027 — Planificador de Viaje',
      en: 'Japan 2027 — Trip Planner',
    },
    description: {
      es: 'App de planificación de viaje con Astro SSR, Drizzle ORM y PostgreSQL. Itinerario con detección de solapamientos, división de gastos, modo offline (PWA) y sincronización en tiempo real vía WebSocket sobre LISTEN/NOTIFY.',
      en: 'Trip planning app with Astro SSR, Drizzle ORM and PostgreSQL. Itinerary with overlap detection, expense splitting, offline mode (PWA) and real-time sync via WebSocket over LISTEN/NOTIFY.',
    },
    detailSlug: 'japan-2027',
    tags: ['Astro', 'PostgreSQL', 'TypeScript', 'PWA'],
  },
  {
    // Repo privado (verificado con la API de GitHub), sin demo pública.
    id: 'proj-12',
    name: {
      es: 'Autogasto — Bot de Gastos con Visión',
      en: 'Autogasto — Vision-based Expense Bot',
    },
    description: {
      es: 'Bot de Telegram que registra gastos a partir de fotos de tickets. GPT-4o Vision extrae los datos, FastAPI los valida y Supabase los persiste. Desplegado en Railway sobre Docker.',
      en: 'Telegram bot that logs expenses from receipt photos. GPT-4o Vision extracts the data, FastAPI validates it and Supabase persists it. Deployed on Railway over Docker.',
    },
    detailSlug: 'autogasto',
    tags: ['AI', 'FastAPI', 'Supabase', 'GPT-4o'],
  },
];
