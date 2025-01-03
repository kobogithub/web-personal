export interface Skills {
  name: string;
  tags?: string[];
  description?: string;
  postLink?: string;
  icon: string;
  [key: string]: any;
}

export const skills: Skills[] = [
  {
    name: "Python",
    description:
      "Experiencia construyendo Backend FastAPI/Flask, como desarrollo de DAGs en Airflow",
    tags: ["Backend", "Airflow"],
    icon: "simple-icons:python",
  },
  {
    name: "AWS",
    description: "Diseño e implementación de Arquitecturas en la Nube de AWS",
    tags: ["Cloud", "Infrastructure"],
    icon: "simple-icons:amazonaws",
  },
  {
    name: "Bash",
    description: "Procesos de automatización y tareas en Bash/Zsh",
    tags: ["Shell", "Automation"],
    icon: "simple-icons:gnubash",
  },
  {
    name: "Docker",
    description:
      "Construcción de Imagenes, resolución de vulnerabilidad y optimización de servicios",
    tags: ["DevOps", "Containers"],
    icon: "simple-icons:docker",
  },
  {
    name: "Kubernetes",
    description:
      "Construcción de cluster EKS, Kops y experiencia en despliegues de Kustomize/Helm",
    tags: ["DevOps", "Orchestration"],
    icon: "simple-icons:kubernetes",
  },
  {
    name: "GitHub Actions",
    description: "Desarrollo de workflows en CI/CD con Github",
    tags: ["CI/CD", "DevOps"],
    icon: "simple-icons:githubactions",
  },
  {
    name: "Terraform",
    description: "Repositorio de Infraestructura por Modulos",
    tags: ["IaC", "DevOps"],
    icon: "simple-icons:terraform",
  },
  {
    name: "Git",
    description: "Trabajos con multiples ramas qa/dev/prod y funcionalidades",
    tags: ["Version Control", "DevOps"],
    icon: "simple-icons:git",
  },
  {
    name: "Jenkins",
    description: "Servidor local para la automatización de tareas personales",
    tags: ["CI/CD", "Automation"],
    icon: "simple-icons:jenkins",
  },
  {
    name: "Jira",
    description: "Gestión de proyecto por sprint y milestone",
    tags: ["Agile", "Project Management"],
    icon: "simple-icons:jira",
  },
  {
    name: "Fluent Bit",
    description: "Modelo de colección por Docker o Kubernetes",
    tags: ["Logging", "Observability"],
    icon: "simple-icons:fluentbit",
  },
  {
    name: "Nginx",
    description: "Manejo de multiples hosts y servicios para HTTP/HTTPS",
    tags: ["Web Server", "DevOps"],
    icon: "simple-icons:nginx",
  },
  {
    name: "Nix",
    description:
      "Lenguaje de gestor de entorno local para configuraciones en linux",
    tags: ["Package Manager", "DevOps"],
    icon: "simple-icons:nixos",
  },
  {
    name: "Podman",
    description:
      "Experiencia en migraciones de Docker a Podman para modelos K8s",
    tags: ["Containers", "DevOps"],
    icon: "simple-icons:podman",
  },
];
