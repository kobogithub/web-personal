# Cambios Pendientes - Alineación con CV y GitHub Profile

> Este documento detalla los cambios necesarios para que la web personal (`kobouharriet.me`) esté alineada con el CV (`cv/Kevin_Barroso_CV.yaml`) y el perfil de GitHub (`kobogithub/README.md`) actualizados en Febrero 2026.

---

## 1. Componente Author (`src/components/Author.astro`)

**Problema:** Texto hardcodeado, no usa sistema de traducciones.

| Actual | Nuevo |
|---|---|
| `Solutions Architect` | `Solutions Architect / AI Engineer` |

**Acción:** Cambiar línea 37 o migrar a usar claves de traducción de `ui` en `index.ts`.

---

## 2. Traducciones principales (`src/i18n/translations.ts`)

### 2.1 Home - Intro (ES)

| Clave | Actual | Nuevo |
|---|---|---|
| `home.intro.p1` | "Arquitecto de Soluciones/SRE Ssr con amplia experiencia en contenedores y cloud computing..." | "Arquitecto de Soluciones/AI Engineer/SRE Ssr con amplia experiencia en contenedores, cloud computing e inteligencia artificial. Lidero equipos en la implementación de arquitecturas de datos y sistemas de IA, optimizando el rendimiento y la escalabilidad. Especialista en implementación de servicios en arquitecturas ECS/EKS y diseño de soluciones basadas en LLMs, sistemas multi-agente y RAG." |
| `home.intro.p2` | "Mi pasión es crear sistemas robustos... Ssr en AWS, Kubernetes, CI/CD, seguridad en la nube y automatización de infraestructura..." | "Mi pasión es crear sistemas robustos y eficientes que impulsen la innovación, inspirando a los equipos a alcanzar la excelencia técnica. Experto en AWS, GCP, Azure ML, Kubernetes, CI/CD, LangChain/LangGraph, OpenAI, MCP y automatización de infraestructura. Destaco por mi comunicación efectiva, resolución de problemas complejos y gestión de proyectos ágiles. Docente universitario en Ingeniería de IA y Sistemas Inteligentes." |

### 2.2 Home - Intro (EN)

| Clave | Nuevo |
|---|---|
| `home.intro.p1` | "Solutions Architect/AI Engineer/Senior SRE with extensive experience in containers, cloud computing and artificial intelligence. I lead teams in implementing data architectures and AI systems, optimizing performance and scalability. Specialist in ECS/EKS service implementation and designing solutions based on LLMs, multi-agent systems and RAG." |
| `home.intro.p2` | "My passion is creating robust and efficient systems that drive innovation, inspiring teams to achieve technical excellence. Expert in AWS, GCP, Azure ML, Kubernetes, CI/CD, LangChain/LangGraph, OpenAI, MCP and infrastructure automation. I excel at effective communication, solving complex problems and agile project management. University lecturer in AI Engineering and Intelligent Systems." |

### 2.3 About - Intro (ES y EN)

Mismos cambios que Home intro (las claves `about.intro.p1` y `about.intro.p2` deben coincidir con `home.intro.p1` y `home.intro.p2`).

### 2.4 About - Taligent Position

| Clave | Actual | Nuevo |
|---|---|---|
| `about.taligent.position` (ES) | "Líder Técnico - Ingeniería de Datos" | "Platform Manager" |
| `about.taligent.position` (EN) | "Technical Lead - Data Engineering" | "Platform Manager" |

### 2.5 About - Taligent Tasks (agregar nuevos)

Agregar las siguientes claves **nuevas** después de `task7`:

| Clave (ES) | Texto |
|---|---|
| `about.taligent.task8` | "Desarrollo de agentes de IA para procesamiento inteligente de documentos con OpenAI GPT-4o, AWS Textract y LangChain/LangGraph" |
| `about.taligent.task9` | "Diseño e implementación de sistemas multi-agente con Model Context Protocol (MCP) para automatización de flujos de trabajo" |
| `about.taligent.task10` | "Construcción de pipelines de NLP y OCR para extracción inteligente de datos de mensajes de WhatsApp y comprobantes" |
| `about.taligent.task11` | "Implementación de prompt engineering con templates versionados y métricas de tokens" |
| `about.taligent.task12` | "Liderazgo del programa de adopción de IA en la organización, incluyendo capacitación y evaluación de herramientas" |
| `about.taligent.task13` | "Desarrollo de plataforma de datos con DuckDB, Streamlit y workflows asistidos por IA" |
| `about.taligent.task14` | "Diseño de infraestructura cloud para servicios de IA en AWS (ECS/Fargate + OpenAI) y GCP (BigQuery, Cloud Functions, Cloud Run)" |
| `about.taligent.task15` | "Desarrollo de framework CLI en Rust para desarrollo asistido por IA con gestión de agentes y skills" |

| Clave (EN) | Texto |
|---|---|
| `about.taligent.task8` | "Development of AI agents for intelligent document processing with OpenAI GPT-4o, AWS Textract and LangChain/LangGraph" |
| `about.taligent.task9` | "Design and implementation of multi-agent systems with Model Context Protocol (MCP) for workflow automation" |
| `about.taligent.task10` | "Building NLP and OCR pipelines for intelligent data extraction from WhatsApp messages and receipts" |
| `about.taligent.task11` | "Implementation of prompt engineering with versioned templates and token metrics" |
| `about.taligent.task12` | "Leadership of AI adoption program in the organization, including training and tool evaluation" |
| `about.taligent.task13` | "Development of data platform with DuckDB, Streamlit and AI-assisted workflows" |
| `about.taligent.task14` | "Cloud infrastructure design for AI services on AWS (ECS/Fargate + OpenAI) and GCP (BigQuery, Cloud Functions, Cloud Run)" |
| `about.taligent.task15` | "Development of CLI framework in Rust for AI-assisted development with agent and skills management" |

**Nota:** También se debe actualizar la template `about.astro` y `en/about.astro` para renderizar los tasks 8-15.

### 2.6 About - Freelance Tasks (agregar nuevo)

| Clave (ES) | Texto |
|---|---|
| `about.freelance.task10` | "Diseño e implementación de Data Lakes con arquitectura medallion (bronze/silver/diamond) usando AWS Glue, S3 y Jupyter Notebooks" |

| Clave (EN) | Texto |
|---|---|
| `about.freelance.task10` | "Design and implementation of Data Lakes with medallion architecture (bronze/silver/diamond) using AWS Glue, S3 and Jupyter Notebooks" |

**Nota:** También se debe actualizar la template `about.astro` y `en/about.astro` para renderizar el task 10 de freelance.

### 2.7 About - Agregar sección Docencia (NUEVA)

Agregar claves para la sección de Docencia en UTN Rosario:

| Clave (ES) | Texto |
|---|---|
| `about.teaching` | "Docencia" |
| `about.utn.position` | "Docente de Ingeniería de IA y Sistemas Inteligentes" |
| `about.utn.company` | "Universidad Tecnológica Nacional - Rosario" |
| `about.utn.period` | "Enero 2024 - Presente" |
| `about.utn.summary` | "Programa intensivo de 33 horas enfocado en AI Engineering, Vibe Engineering y desarrollo de sistemas complejos, con aplicaciones en agroindustria, bienestar social y economías dinámicas." |
| `about.utn.task1` | "Diseño e impartición del programa 'Análisis de Datos, Ingeniería de IA y Sistemas Inteligentes (Nivel 1)'" |
| `about.utn.task2` | "Cobertura de Modern Python Stack, Machine Learning, NLP, Computer Vision y Sistemas Agénticos (MCP)" |
| `about.utn.task3` | "Enseñanza de MLOps, RAG (Retrieval-Augmented Generation), Vector Databases y Cloud Deploy" |
| `about.utn.task4` | "Stack tecnológico: Python 3.12+, Docker, AWS/Google Cloud, Transformers, Streamlit, PostgreSQL" |

| Clave (EN) | Texto |
|---|---|
| `about.teaching` | "Teaching" |
| `about.utn.position` | "Lecturer in AI Engineering and Intelligent Systems" |
| `about.utn.company` | "Universidad Tecnológica Nacional - Rosario" |
| `about.utn.period` | "January 2024 - Present" |
| `about.utn.summary` | "Intensive 33-hour program focused on AI Engineering, Vibe Engineering and complex systems development, with applications in agroindustry, social welfare and dynamic economies." |
| `about.utn.task1` | "Design and delivery of the program 'Data Analysis, AI Engineering and Intelligent Systems (Level 1)'" |
| `about.utn.task2` | "Coverage of Modern Python Stack, Machine Learning, NLP, Computer Vision and Agentic Systems (MCP)" |
| `about.utn.task3` | "Teaching MLOps, RAG (Retrieval-Augmented Generation), Vector Databases and Cloud Deploy" |
| `about.utn.task4` | "Tech stack: Python 3.12+, Docker, AWS/Google Cloud, Transformers, Streamlit, PostgreSQL" |

**Nota:** Se debe agregar una nueva sección en las templates `about.astro` y `en/about.astro` para renderizar Docencia.

### 2.8 Contact - Help Options

Agregar opciones de ayuda relacionadas con IA:

| Clave (ES) | Texto |
|---|---|
| `contact.help.ai` | "Inteligencia Artificial & LLMs" |
| `contact.help.data` | "Data Engineering & Analytics" |

| Clave (EN) | Texto |
|---|---|
| `contact.help.ai` | "Artificial Intelligence & LLMs" |
| `contact.help.data` | "Data Engineering & Analytics" |

---

## 3. UI Translations (`src/i18n/index.ts`)

### 3.1 Author Description

| Clave | Actual | Nuevo |
|---|---|---|
| `author.description` (ES) | "Kevin es un Arquitecto de Soluciones/SRE con experiencia en diseño, desarrollo e implementaciones en la nube de" | "Kevin es un Arquitecto de Soluciones/AI Engineer/SRE con experiencia en IA, cloud computing y sistemas inteligentes en" |
| `author.description` (EN) | "Kevin is a Solutions Architect/SRE with experience in design, development and cloud implementations on" | "Kevin is a Solutions Architect/AI Engineer/SRE with experience in AI, cloud computing and intelligent systems on" |

### 3.2 Site Tagline y Description

| Clave | Actual | Nuevo |
|---|---|---|
| `site.tagline` (ES) | "WebPersonal con experiencias, habilidades y proyectos" | "AI Engineer, Arquitecto de Soluciones & SRE Senior" |
| `site.description` (ES) | "Blog Personal de Proyectos, Habilidades y experiencia laboral" | "Blog personal de IA, Cloud, Kubernetes y experiencia en Arquitectura de Soluciones" |
| `site.tagline` (EN) | "Personal website with experiences, skills and projects" | "AI Engineer, Solutions Architect & Senior SRE" |
| `site.description` (EN) | "Personal Blog of Projects, Skills and work experience" | "Personal blog about AI, Cloud, Kubernetes and Solutions Architecture experience" |

---

## 4. Constantes del sitio (`src/consts.ts`)

| Constante | Actual | Nuevo |
|---|---|---|
| `SITE_TAGLINE` | "WebPersonal con experiencias, habilidades y proyectos" | "AI Engineer, Arquitecto de Soluciones & SRE Senior" |
| `SITE_DESCRIPTION` | "Blog Personal de Proyectos, Habilidades y experiencia laboral" | "Blog personal de IA, Cloud, Kubernetes y experiencia en Arquitectura de Soluciones" |

---

## 5. Skills (`src/pages/skills/skills.ts`)

### 5.1 Nuevas skills a agregar

| Skill | Tags | Descripción ES | Descripción EN | Icono |
|---|---|---|---|---|
| OpenAI | AI, LLMs | Desarrollo de agentes con GPT-4o y GPT-4.1 para procesamiento de documentos y NLP | Development of agents with GPT-4o and GPT-4.1 for document processing and NLP | `simple-icons:openai` |
| LangChain | AI, Orchestration | Orquestación de workflows de IA con LangChain y LangGraph | AI workflow orchestration with LangChain and LangGraph | `simple-icons:langchain` |
| Hugging Face | AI, ML | Transformers para NLP y Computer Vision | Transformers for NLP and Computer Vision | `simple-icons:huggingface` |
| PyTorch | AI, Deep Learning | Framework de Deep Learning para entrenamiento de modelos | Deep Learning framework for model training | `simple-icons:pytorch` |
| TensorFlow | AI, Deep Learning | Entrenamiento y despliegue de modelos de ML | ML model training and deployment | `simple-icons:tensorflow` |
| scikit-learn | AI, ML | Machine Learning clásico y análisis de datos | Classic Machine Learning and data analysis | `simple-icons:scikitlearn` |
| Rust | Systems, CLI | Desarrollo de herramientas CLI de alto rendimiento | High-performance CLI tool development | `simple-icons:rust` |
| Streamlit | Data, Visualization | Dashboards interactivos y aplicaciones de datos | Interactive dashboards and data applications | `simple-icons:streamlit` |
| DuckDB | Data, Analytics | Motor analítico embebido para procesamiento de datos | Embedded analytical engine for data processing | `simple-icons:duckdb` |
| OpenCV | AI, Computer Vision | Procesamiento de imágenes y visión por computadora | Image processing and computer vision | `simple-icons:opencv` |
| GCP | Cloud, Infrastructure | BigQuery, Cloud Functions y Cloud Run en Google Cloud | BigQuery, Cloud Functions and Cloud Run on Google Cloud | `simple-icons:googlecloud` |
| Azure | Cloud, ML | Azure ML SDK para entrenamiento de modelos en la nube | Azure ML SDK for cloud model training | `simple-icons:microsoftazure` |
| FastAPI | Backend, API | Desarrollo de APIs de alto rendimiento en Python | High-performance API development in Python | `simple-icons:fastapi` |
| N8N | Automation, Workflow | Automatización de workflows y procesos de negocio | Business workflow and process automation | `simple-icons:n8n` |
| NestJS | Backend, API | Desarrollo de APIs empresariales con TypeScript | Enterprise API development with TypeScript | `simple-icons:nestjs` |

### 5.2 Skills a considerar eliminar (poco relevantes para el perfil actual)

- Tmux
- Nix (mantener solo si es relevante)
- Podman (baja prioridad)
- Redash (baja prioridad)

---

## 6. Proyectos (`src/pages/projects/projects.ts`)

### 6.1 Nuevos proyectos a agregar

| Proyecto | Descripción ES | Descripción EN | Tags |
|---|---|---|---|
| Agentes IA - Procesamiento de Documentos | Sistema de agentes de IA que procesa comprobantes y mensajes usando OCR, NLP y LangChain/LangGraph | AI agent system that processes receipts and messages using OCR, NLP and LangChain/LangGraph | AI, LangChain, OpenAI |
| Extractor IA de Granos | Procesador inteligente de mensajes de WhatsApp para mesas de granos con NLP y visión por computadora | Intelligent WhatsApp message processor for grain trading desks with NLP and computer vision | AI, NLP, FastAPI |
| Knowledge Framework | Framework multi-agente para desarrollo asistido por IA con MCP y 8+ agentes especializados | Multi-agent framework for AI-assisted development with MCP and 8+ specialized agents | AI, Multi-Agent, MCP |
| Knowledge CLI | CLI en Rust para desarrollo asistido por IA con gestión de agentes y skills | Rust CLI for AI-assisted development with agent and skills management | Rust, AI, CLI |
| Data Lake AWS | Arquitectura data lake híbrida con ingesta automatizada y arquitectura medallion | Hybrid data lake architecture with automated ingestion and medallion architecture | AWS, Data, Glue |

---

## 7. Traducciones duplicadas (`src/i18n/es.ts` y `src/i18n/en.ts`)

Verificar si estos archivos tienen claves que deban actualizarse también. Hay duplicación con `translations.ts` - idealmente consolidar en un solo sistema.

---

## 8. Templates About (`src/pages/about.astro` y `src/pages/en/about.astro`)

### Cambios estructurales necesarios:
1. Agregar rendering de tasks 8-15 de Taligent
2. Agregar rendering de task 10 de Freelance
3. Agregar nueva sección "Docencia" con UTN Rosario
4. Renderizar las nuevas claves de Docencia (position, period, summary, tasks)

---

## 9. Página de Contact (hardcoded)

**Problema:** `src/pages/contact.astro` tiene texto hardcodeado en español, mientras que `src/pages/en/contact.astro` usa claves de traducción.

**Acción:** Migrar `contact.astro` para usar el sistema de traducciones como la versión en inglés.

---

## Resumen de archivos a modificar

| Archivo | Tipo de cambio |
|---|---|
| `src/components/Author.astro` | Actualizar subtítulo hardcodeado |
| `src/i18n/translations.ts` | Actualizar intros, agregar tasks, agregar sección docencia |
| `src/i18n/index.ts` | Actualizar author.description, site.tagline, site.description |
| `src/consts.ts` | Actualizar SITE_TAGLINE, SITE_DESCRIPTION |
| `src/pages/skills/skills.ts` | Agregar ~15 skills nuevas de IA/ML |
| `src/pages/projects/projects.ts` | Agregar ~5 proyectos nuevos de IA |
| `src/pages/about.astro` | Agregar tasks y sección Docencia |
| `src/pages/en/about.astro` | Agregar tasks y sección Docencia |
| `src/pages/contact.astro` | Migrar a sistema de traducciones |
| `src/i18n/es.ts` | Verificar y actualizar si hay claves duplicadas |
| `src/i18n/en.ts` | Verificar y actualizar si hay claves duplicadas |

---

## Prioridades

1. **Alta** - Intro/bio (home + about) - Es lo primero que ve el visitante
2. **Alta** - Skills nuevas de IA - Reflejan las capacidades actuales
3. **Alta** - Experiencia Taligent (tasks IA) - Experiencia laboral actual
4. **Alta** - Sección Docencia UTN - Diferenciador importante
5. **Media** - Proyectos nuevos de IA
6. **Media** - Author component y constantes del sitio
7. **Baja** - Consolidar sistema de traducciones duplicado
8. **Baja** - Migrar contact.astro a traducciones
