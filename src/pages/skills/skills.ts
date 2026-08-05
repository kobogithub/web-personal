export interface Skills {
  name: string;
  tags?: string[];
  description?: {
    es: string;
    en: string;
  };
  postLink?: string;
  icon: string;
  [key: string]: any;
}

export interface LocalizedSkill {
  name: string;
  tags?: string[];
  description?: string;
  postLink?: string;
  icon: string;
  [key: string]: any;
}

export function getLocalizedSkills(lang: 'es' | 'en'): LocalizedSkill[] {
  return skills.map((skill) => ({
    ...skill,
    description: skill.description ? skill.description[lang] : undefined,
  }));
}

export const skills: Skills[] = [
  {
    name: 'Python',
    description: {
      es: 'Experiencia construyendo Backend FastAPI/Flask, como desarrollo de DAGs en Airflow',
      en: 'Experience building Backend with FastAPI/Flask, as well as developing DAGs in Airflow',
    },
    tags: ['Backend', 'Airflow'],
    icon: 'simple-icons:python',
  },
  {
    name: 'AWS',
    description: {
      es: 'Diseño e implementación de Arquitecturas en la Nube de AWS',
      en: 'Design and implementation of AWS Cloud Architectures',
    },
    tags: ['Cloud', 'Infrastructure'],
    icon: 'simple-icons:amazonaws',
  },
  {
    name: 'Bash',
    description: {
      es: 'Procesos de automatización y tareas en Bash/Zsh',
      en: 'Automation processes and tasks in Bash/Zsh',
    },
    tags: ['Shell', 'Automation'],
    icon: 'simple-icons:gnubash',
  },
  {
    name: 'Docker',
    description: {
      es: 'Construcción de Imagenes, resolución de vulnerabilidad y optimización de servicios',
      en: 'Image building, vulnerability resolution and service optimization',
    },
    tags: ['DevOps', 'Containers'],
    icon: 'simple-icons:docker',
  },
  {
    name: 'Kubernetes',
    description: {
      es: 'Construcción de clusters EKS y GKE privados, migración ECS a EKS, despliegues con Kustomize/Helm',
      en: 'Building private EKS and GKE clusters, ECS to EKS migration, deployments with Kustomize/Helm',
    },
    tags: ['DevOps', 'Orchestration'],
    icon: 'simple-icons:kubernetes',
  },
  {
    name: 'GitHub Actions',
    description: {
      es: 'Desarrollo de workflows en CI/CD con Github',
      en: 'Development of CI/CD workflows with Github',
    },
    tags: ['CI/CD', 'DevOps'],
    icon: 'simple-icons:githubactions',
  },
  {
    name: 'Terraform',
    description: {
      es: 'Módulos reutilizables multi-cloud (AWS, GCP, Microsoft Fabric) con OIDC, backends remotos y escaneo Checkov/tfsec',
      en: 'Reusable multi-cloud modules (AWS, GCP, Microsoft Fabric) with OIDC, remote backends and Checkov/tfsec scanning',
    },
    tags: ['IaC', 'DevOps'],
    icon: 'simple-icons:terraform',
  },
  {
    name: 'Git',
    description: {
      es: 'Trabajos con multiples ramas qa/dev/prod y funcionalidades',
      en: 'Work with multiple branches qa/dev/prod and features',
    },
    tags: ['Version Control', 'DevOps'],
    icon: 'simple-icons:git',
  },
  {
    name: 'Jenkins',
    description: {
      es: 'Servidor local para la automatización de tareas personales',
      en: 'Local server for personal task automation',
    },
    tags: ['CI/CD', 'Automation'],
    icon: 'simple-icons:jenkins',
  },
  {
    name: 'Jira',
    description: {
      es: 'Gestión de proyecto por sprint y milestone',
      en: 'Project management by sprint and milestone',
    },
    tags: ['Agile', 'Project Management'],
    icon: 'simple-icons:jira',
  },
  {
    name: 'Fluent Bit',
    description: {
      es: 'Modelo de colección por Docker o Kubernetes',
      en: 'Collection model for Docker or Kubernetes',
    },
    tags: ['Logging', 'Observability'],
    icon: 'simple-icons:fluentbit',
  },
  {
    name: 'Nginx',
    description: {
      es: 'Manejo de multiples hosts y servicios para HTTP/HTTPS',
      en: 'Managing multiple hosts and services for HTTP/HTTPS',
    },
    tags: ['Web Server', 'DevOps'],
    icon: 'simple-icons:nginx',
  },
  {
    name: 'Nix',
    description: {
      es: 'Lenguaje de gestor de entorno local para configuraciones en linux',
      en: 'Local environment manager language for linux configurations',
    },
    tags: ['Package Manager', 'DevOps'],
    icon: 'simple-icons:nixos',
  },
  {
    name: 'Podman',
    description: {
      es: 'Experiencia en migraciones de Docker a Podman para modelos K8s',
      en: 'Experience in migrations from Docker to Podman for K8s models',
    },
    tags: ['Containers', 'DevOps'],
    icon: 'simple-icons:podman',
  },
  {
    name: 'Concourse CI',
    description: {
      es: 'Experiencia pipelines de CI/CD',
      en: 'Experience in CI/CD pipelines',
    },
    tags: ['Containers', 'DevOps', 'CI/CD'],
    icon: 'simple-icons:concourse',
  },
  {
    name: 'PostgreSQL',
    description: {
      es: 'Experiencia en base de datos para Warehouse o Aplicaciones',
      en: 'Experience in databases for Warehouse or Applications',
    },
    tags: ['Containers', 'Database'],
    icon: 'simple-icons:postgresql',
  },
  {
    name: 'Metabase',
    description: {
      es: 'Desarrollo de visualizaciones y dashboard',
      en: 'Development of visualizations and dashboards',
    },
    tags: ['Containers', 'BI'],
    icon: 'simple-icons:metabase',
  },
  {
    name: 'Airflow',
    description: {
      es: 'Orquestacion de tareas en entornos docker, kubernetes, bare-metal o MWAA',
      en: 'Task orchestration in docker, kubernetes, bare-metal or MWAA environments',
    },
    tags: ['Orchestration'],
    icon: 'simple-icons:apacheairflow',
  },
  {
    name: 'Fluentd',
    description: {
      es: 'Collector de Logs y centralizacion en DB ElasticSearch',
      en: 'Log collector and centralization in ElasticSearch DB',
    },
    tags: ['Containers', 'Monitoring'],
    icon: 'simple-icons:fluentd',
  },
  {
    name: 'Prometheus',
    description: {
      es: 'Exposicion de metricas a nivel nodos o contenedores',
      en: 'Metrics exposure at node or container level',
    },
    tags: ['Containers', 'Monitoring'],
    icon: 'simple-icons:prometheus',
  },
  {
    name: 'Grafana',
    description: {
      es: 'Dashboard de monitoreos en servidores propios como en gran escala',
      en: 'Monitoring dashboard on own servers as well as at large scale',
    },
    tags: ['Containers', 'Monitoring'],
    icon: 'simple-icons:grafana',
  },
  {
    name: 'Crossplane',
    description: {
      es: 'Gestión de infraestructura cloud usando Kubernetes como plano de control',
      en: 'Cloud infrastructure management using Kubernetes as control plane',
    },
    tags: ['IaC', 'Kubernetes', 'Cloud'],
    icon: 'simple-icons:cncf',
  },
  {
    name: 'OpenAI',
    description: {
      es: 'Desarrollo de agentes con GPT-4o y GPT-4.1 para procesamiento de documentos y NLP',
      en: 'Development of agents with GPT-4o and GPT-4.1 for document processing and NLP',
    },
    tags: ['AI', 'LLMs'],
    icon: 'simple-icons:openai',
  },
  {
    name: 'LangChain',
    description: {
      es: 'Orquestación de workflows de IA con LangChain y LangGraph',
      en: 'AI workflow orchestration with LangChain and LangGraph',
    },
    tags: ['AI', 'Orchestration'],
    icon: 'simple-icons:langchain',
  },
  {
    name: 'Hugging Face',
    description: {
      es: 'Transformers para NLP y Computer Vision',
      en: 'Transformers for NLP and Computer Vision',
    },
    tags: ['AI', 'ML'],
    icon: 'simple-icons:huggingface',
  },
  {
    name: 'PyTorch',
    description: {
      es: 'Framework de Deep Learning para entrenamiento de modelos',
      en: 'Deep Learning framework for model training',
    },
    tags: ['AI', 'Deep Learning'],
    icon: 'simple-icons:pytorch',
  },
  {
    name: 'TensorFlow',
    description: {
      es: 'Entrenamiento y despliegue de modelos de ML',
      en: 'ML model training and deployment',
    },
    tags: ['AI', 'Deep Learning'],
    icon: 'simple-icons:tensorflow',
  },
  {
    name: 'scikit-learn',
    description: {
      es: 'Machine Learning clásico y análisis de datos',
      en: 'Classic Machine Learning and data analysis',
    },
    tags: ['AI', 'ML'],
    icon: 'simple-icons:scikitlearn',
  },
  {
    name: 'Rust',
    description: {
      es: 'Desarrollo de herramientas CLI de alto rendimiento',
      en: 'High-performance CLI tool development',
    },
    tags: ['Systems', 'CLI'],
    icon: 'simple-icons:rust',
  },
  {
    name: 'Streamlit',
    description: {
      es: 'Dashboards interactivos y aplicaciones de datos',
      en: 'Interactive dashboards and data applications',
    },
    tags: ['Data', 'Visualization'],
    icon: 'simple-icons:streamlit',
  },
  {
    name: 'DuckDB',
    description: {
      es: 'Motor analítico embebido para procesamiento de datos',
      en: 'Embedded analytical engine for data processing',
    },
    tags: ['Data', 'Analytics'],
    icon: 'simple-icons:duckdb',
  },
  {
    name: 'OpenCV',
    description: {
      es: 'Procesamiento de imágenes y visión por computadora',
      en: 'Image processing and computer vision',
    },
    tags: ['AI', 'Computer Vision'],
    icon: 'simple-icons:opencv',
  },
  {
    name: 'GCP',
    description: {
      es: 'Plataforma GKE con Terraform, Cloud Run, Cloud SQL, BigQuery, Artifact Registry y Secret Manager',
      en: 'GKE platform with Terraform, Cloud Run, Cloud SQL, BigQuery, Artifact Registry and Secret Manager',
    },
    tags: ['Cloud', 'Infrastructure'],
    icon: 'simple-icons:googlecloud',
  },
  {
    name: 'Azure',
    description: {
      es: 'Azure Data Factory, Databricks y Microsoft Fabric para pipelines de datos productivos; Azure ML para entrenamiento de modelos',
      en: 'Azure Data Factory, Databricks and Microsoft Fabric for production data pipelines; Azure ML for model training',
    },
    tags: ['Cloud', 'Data', 'ML'],
    icon: 'simple-icons:microsoftazure',
  },
  {
    name: 'FastAPI',
    description: {
      es: 'Desarrollo de APIs de alto rendimiento en Python',
      en: 'High-performance API development in Python',
    },
    tags: ['Backend', 'API'],
    icon: 'simple-icons:fastapi',
  },
  {
    name: 'N8N',
    description: {
      es: 'Automatización de workflows y procesos de negocio',
      en: 'Business workflow and process automation',
    },
    tags: ['Automation', 'Workflow'],
    icon: 'simple-icons:n8n',
  },
  {
    name: 'NestJS',
    description: {
      es: 'Desarrollo de APIs empresariales con TypeScript',
      en: 'Enterprise API development with TypeScript',
    },
    tags: ['Backend', 'API'],
    icon: 'simple-icons:nestjs',
  },

  // Stack Azure/Microsoft y data moderno
  {
    name: 'Azure Data Factory',
    description: {
      es: 'Orquestación de pipelines de datos y migración de workflows legacy desde Informatica PowerCenter',
      en: 'Data pipeline orchestration and migration of legacy Informatica PowerCenter workflows',
    },
    tags: ['Cloud', 'Data', 'Orchestration'],
    icon: 'simple-icons:microsoftazure',
  },
  {
    name: 'Databricks',
    description: {
      es: 'Pipelines Bronze/Silver/Diamond con PySpark y Databricks Asset Bundles',
      en: 'Bronze/Silver/Diamond pipelines with PySpark and Databricks Asset Bundles',
    },
    tags: ['Data', 'Analytics'],
    icon: 'simple-icons:databricks',
  },
  {
    name: 'Snowflake',
    description: {
      es: 'Data warehouse destino de pipelines productivos, tablas transient y vistas de transformación',
      en: 'Target data warehouse for production pipelines, transient tables and transformation views',
    },
    tags: ['Database', 'Data Warehouse'],
    icon: 'simple-icons:snowflake',
  },
  {
    name: 'Microsoft Fabric',
    description: {
      es: 'Módulos Terraform para capacity, workspaces, lakehouses medallón y Spark pools, con GitOps por ramas',
      en: 'Terraform modules for capacity, workspaces, medallion lakehouses and Spark pools, with branch-based GitOps',
    },
    tags: ['Cloud', 'Data'],
    icon: 'simple-icons:microsoft',
  },
  {
    name: 'dbt',
    description: {
      es: 'ELT declarativo con tests y linaje sobre DuckDB',
      en: 'Declarative ELT with tests and lineage on DuckDB',
    },
    tags: ['Data', 'Transformation'],
    icon: 'simple-icons:dbt',
  },
  {
    name: 'Apache Iceberg',
    description: {
      es: 'Formato de tabla abierto para lakehouse medallion',
      en: 'Open table format for medallion lakehouse',
    },
    tags: ['Data', 'Lakehouse'],
    // simple-icons no tiene logo de Apache Iceberg (verificado contra el set
    // instalado y la API de Iconify). `tabler:iceberg` es genérico, no de marca.
    icon: 'tabler:iceberg',
  },
  {
    name: 'MinIO',
    description: {
      es: 'Object storage S3-compatible para data lakes on-premise',
      en: 'S3-compatible object storage for on-premise data lakes',
    },
    tags: ['Storage', 'Data'],
    icon: 'simple-icons:minio',
  },
  {
    name: 'PySpark',
    description: {
      es: 'Procesamiento distribuido y parseo de archivos fixed-width en Databricks',
      en: 'Distributed processing and fixed-width file parsing on Databricks',
    },
    tags: ['Data', 'Processing'],
    icon: 'simple-icons:apachespark',
  },

  // Stack full-stack y testing
  {
    name: 'Next.js',
    description: {
      es: 'Aplicaciones App Router con Server Actions, desplegadas en Cloud Run',
      en: 'App Router applications with Server Actions, deployed on Cloud Run',
    },
    tags: ['Frontend', 'Fullstack'],
    icon: 'simple-icons:nextdotjs',
  },
  {
    name: 'React',
    description: {
      es: 'Interfaces con React 19, TanStack Table y React Hook Form',
      en: 'Interfaces with React 19, TanStack Table and React Hook Form',
    },
    tags: ['Frontend'],
    icon: 'simple-icons:react',
  },
  {
    name: 'TypeScript',
    description: {
      es: 'Desarrollo full-stack en modo strict, validación de esquemas con Zod',
      en: 'Full-stack development in strict mode, schema validation with Zod',
    },
    tags: ['Language', 'Frontend'],
    icon: 'simple-icons:typescript',
  },
  {
    name: 'Prisma',
    description: {
      es: 'Modelado de datos y migraciones sobre PostgreSQL',
      en: 'Data modeling and migrations on PostgreSQL',
    },
    tags: ['ORM', 'Backend'],
    icon: 'simple-icons:prisma',
  },
  {
    name: 'Tailwind CSS',
    description: {
      es: 'Sistemas de diseño con tokens y modo claro/oscuro',
      en: 'Design systems with tokens and light/dark mode',
    },
    tags: ['Frontend', 'CSS'],
    icon: 'simple-icons:tailwindcss',
  },
  {
    name: 'Playwright',
    description: {
      es: 'Tests end-to-end en CI con Postgres efímera',
      en: 'End-to-end tests in CI with ephemeral Postgres',
    },
    tags: ['Testing', 'QA'],
    icon: 'simple-icons:playwright',
  },
  {
    name: 'Vitest',
    description: {
      es: 'Tests unitarios y de integración',
      en: 'Unit and integration tests',
    },
    tags: ['Testing', 'QA'],
    icon: 'simple-icons:vitest',
  },
];
