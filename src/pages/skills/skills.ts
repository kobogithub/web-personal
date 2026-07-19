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
      es: 'Construcción de cluster EKS, Kops y experiencia en despliegues de Kustomize/Helm',
      en: 'Building EKS clusters, Kops and experience in Kustomize/Helm deployments',
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
      es: 'Repositorio de Infraestructura por Modulos',
      en: 'Infrastructure Repository by Modules',
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
      es: 'BigQuery, Cloud Functions y Cloud Run en Google Cloud',
      en: 'BigQuery, Cloud Functions and Cloud Run on Google Cloud',
    },
    tags: ['Cloud', 'Infrastructure'],
    icon: 'simple-icons:googlecloud',
  },
  {
    name: 'Azure',
    description: {
      es: 'Azure ML SDK para entrenamiento de modelos en la nube',
      en: 'Azure ML SDK for cloud model training',
    },
    tags: ['Cloud', 'ML'],
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
];
