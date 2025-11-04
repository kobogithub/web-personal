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
  return skills.map(skill => ({
    ...skill,
    description: skill.description ? skill.description[lang] : undefined
  }));
}

export const skills: Skills[] = [
  {
    name: "Python",
    description: {
      es: "Experiencia construyendo Backend FastAPI/Flask, como desarrollo de DAGs en Airflow",
      en: "Experience building Backend with FastAPI/Flask, as well as developing DAGs in Airflow"
    },
    tags: ["Backend", "Airflow"],
    icon: "simple-icons:python",
  },
  {
    name: "AWS",
    description: {
      es: "Diseño e implementación de Arquitecturas en la Nube de AWS",
      en: "Design and implementation of AWS Cloud Architectures"
    },
    tags: ["Cloud", "Infrastructure"],
    icon: "simple-icons:amazonaws",
  },
  {
    name: "Bash",
    description: {
      es: "Procesos de automatización y tareas en Bash/Zsh",
      en: "Automation processes and tasks in Bash/Zsh"
    },
    tags: ["Shell", "Automation"],
    icon: "simple-icons:gnubash",
  },
  {
    name: "Docker",
    description: {
      es: "Construcción de Imagenes, resolución de vulnerabilidad y optimización de servicios",
      en: "Image building, vulnerability resolution and service optimization"
    },
    tags: ["DevOps", "Containers"],
    icon: "simple-icons:docker",
  },
  {
    name: "Kubernetes",
    description: {
      es: "Construcción de cluster EKS, Kops y experiencia en despliegues de Kustomize/Helm",
      en: "Building EKS clusters, Kops and experience in Kustomize/Helm deployments"
    },
    tags: ["DevOps", "Orchestration"],
    icon: "simple-icons:kubernetes",
  },
  {
    name: "GitHub Actions",
    description: {
      es: "Desarrollo de workflows en CI/CD con Github",
      en: "Development of CI/CD workflows with Github"
    },
    tags: ["CI/CD", "DevOps"],
    icon: "simple-icons:githubactions",
  },
  {
    name: "Terraform",
    description: {
      es: "Repositorio de Infraestructura por Modulos",
      en: "Infrastructure Repository by Modules"
    },
    tags: ["IaC", "DevOps"],
    icon: "simple-icons:terraform",
  },
  {
    name: "Git",
    description: {
      es: "Trabajos con multiples ramas qa/dev/prod y funcionalidades",
      en: "Work with multiple branches qa/dev/prod and features"
    },
    tags: ["Version Control", "DevOps"],
    icon: "simple-icons:git",
  },
  {
    name: "Jenkins",
    description: {
      es: "Servidor local para la automatización de tareas personales",
      en: "Local server for personal task automation"
    },
    tags: ["CI/CD", "Automation"],
    icon: "simple-icons:jenkins",
  },
  {
    name: "Jira",
    description: {
      es: "Gestión de proyecto por sprint y milestone",
      en: "Project management by sprint and milestone"
    },
    tags: ["Agile", "Project Management"],
    icon: "simple-icons:jira",
  },
  {
    name: "Fluent Bit",
    description: {
      es: "Modelo de colección por Docker o Kubernetes",
      en: "Collection model for Docker or Kubernetes"
    },
    tags: ["Logging", "Observability"],
    icon: "simple-icons:fluentbit",
  },
  {
    name: "Nginx",
    description: {
      es: "Manejo de multiples hosts y servicios para HTTP/HTTPS",
      en: "Managing multiple hosts and services for HTTP/HTTPS"
    },
    tags: ["Web Server", "DevOps"],
    icon: "simple-icons:nginx",
  },
  {
    name: "Nix",
    description: {
      es: "Lenguaje de gestor de entorno local para configuraciones en linux",
      en: "Local environment manager language for linux configurations"
    },
    tags: ["Package Manager", "DevOps"],
    icon: "simple-icons:nixos",
  },
  {
    name: "Podman",
    description: {
      es: "Experiencia en migraciones de Docker a Podman para modelos K8s",
      en: "Experience in migrations from Docker to Podman for K8s models"
    },
    tags: ["Containers", "DevOps"],
    icon: "simple-icons:podman",
  },
  {
    name: "Tmux",
    description: {
      es: "Experiencia en multiplexor de terminal",
      en: "Experience in terminal multiplexer"
    },
    tags: ["Shell"],
    icon: "simple-icons:tmux",
  },
  {
    name: "Concourse CI",
    description: {
      es: "Experiencia pipelines de CI/CD",
      en: "Experience in CI/CD pipelines"
    },
    tags: ["Containers", "DevOps", "CI/CD"],
    icon: "simple-icons:concourse",
  },
  {
    name: "PostgreSQL",
    description: {
      es: "Experiencia en base de datos para Warehouse o Aplicaciones",
      en: "Experience in databases for Warehouse or Applications"
    },
    tags: ["Containers", "Database"],
    icon: "simple-icons:postgresql",
  },
  {
    name: "Metabase",
    description: {
      es: "Desarrollo de visualizaciones y dashboard",
      en: "Development of visualizations and dashboards"
    },
    tags: ["Containers", "BI"],
    icon: "simple-icons:metabase",
  },
  {
    name: "Redash",
    description: {
      es: "Desarrollo de reportes y wallboards",
      en: "Development of reports and wallboards"
    },
    tags: ["Containers", "BI"],
    icon: "simple-icons:redash",
  },
  {
    name: "Airflow",
    description: {
      es: "Orquestacion de tareas en entornos docker, kubernetes, bare-metal o MWAA",
      en: "Task orchestration in docker, kubernetes, bare-metal or MWAA environments"
    },
    tags: ["Orchestration"],
    icon: "simple-icons:apacheairflow",
  },
  {
    name: "Fluentd",
    description: {
      es: "Collector de Logs y centralizacion en DB ElasticSearch",
      en: "Log collector and centralization in ElasticSearch DB"
    },
    tags: ["Containers", "Monitoring"],
    icon: "simple-icons:fluentd",
  },
  {
    name: "Prometheus",
    description: {
      es: "Exposicion de metricas a nivel nodos o contenedores",
      en: "Metrics exposure at node or container level"
    },
    tags: ["Containers", "Monitoring"],
    icon: "simple-icons:prometheus",
  },
  {
    name: "Grafana",
    description: {
      es: "Dashboard de monitoreos en servidores propios como en gran escala",
      en: "Monitoring dashboard on own servers as well as at large scale"
    },
    tags: ["Containers", "Monitoring"],
    icon: "simple-icons:grafana",
  },
];
