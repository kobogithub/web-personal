/**
 * Spanish (Español) Translation Dictionary
 *
 * This file contains all Spanish translations for the personal website.
 * Spanish is the default language of the site.
 *
 * Keys are organized by section:
 * - nav.* : Navigation menu items
 * - site.* : Site metadata (title, description, etc.)
 * - home.* : Home page content
 * - about.* : About page content
 * - contact.* : Contact page content
 * - projects.* : Projects page content
 */

export const es = {
  // Navigation
  'nav.home': 'Inicio',
  'nav.about': 'About',
  'nav.posts': 'Posts',
  'nav.projects': 'Projects',
  'nav.skills': 'Skills',
  'nav.tags': 'Tags',
  'nav.contact': 'Contacto',

  // Site metadata
  'site.title': 'Kevin Barroso',
  'site.tagline': 'AI Engineer, Arquitecto de Soluciones & SRE Senior',
  'site.description':
    'Blog personal de IA, Cloud, Kubernetes y experiencia en Arquitectura de Soluciones',

  // Home page
  'home.greeting': 'Hola 👋, Kevin Barroso 👷',
  'home.intro.p1':
    'Arquitecto de Soluciones/AI Engineer/SRE Ssr con amplia experiencia en contenedores, cloud computing e inteligencia artificial. Lidero equipos en la implementación de arquitecturas de datos y sistemas de IA, optimizando el rendimiento y la escalabilidad. Especialista en implementación de servicios en arquitecturas ECS/EKS y diseño de soluciones basadas en LLMs, sistemas multi-agente y RAG.',
  'home.intro.p2':
    'Mi pasión es crear sistemas robustos y eficientes que impulsen la innovación, inspirando a los equipos a alcanzar la excelencia técnica. Experto en AWS, GCP, Azure ML, Kubernetes, CI/CD, LangChain/LangGraph, OpenAI, MCP y automatización de infraestructura. Destaco por mi comunicación efectiva, resolución de problemas complejos y gestión de proyectos ágiles. Docente universitario en Ingeniería de IA y Sistemas Inteligentes.',
  'home.recentPosts': 'Recent Posts',
  'home.myProjects': 'My Projects',
  'home.mySkills': 'My Skills',
  'home.allPosts': 'All posts',
  'home.allProjects': 'All projects',
  'home.allSkills': 'All skills',

  // About page
  'about.title': 'Sobre mí',
  'about.description': 'Resumen de experiencias hasta la actualidad',
  'about.workExperience': 'Experiencia Profesional',
  'about.taligent.position': 'Platform Manager',
  'about.taligent.period': 'Noviembre 2022 - Presente',
  'about.freelance.position': 'Solutions Architect AWS + Developer',
  'about.freelance.period': 'Febrero 2019 - Noviembre 2022',

  // Contact page
  'contact.title': 'Contacto',
  'contact.description':
    'Ponte en contacto conmigo para proyectos, colaboraciones o consultas',
  'contact.intro.p1':
    '¡Me encantaría saber de ti! Si tienes algún proyecto interesante, una propuesta de colaboración, o simplemente quieres conectar, no dudes en enviarme un mensaje.',
  'contact.intro.p2':
    'Ya sea que necesites ayuda con arquitectura cloud, desarrollo de aplicaciones, o consultoria técnica, estoy aquí para ayudarte a hacer realidad tus ideas.',
  'contact.email.title': 'Email Directo',
  'contact.email.text': 'Si prefieres escribirme directamente:',
  'contact.responseTime.title': 'Tiempo de Respuesta',
  'contact.responseTime.text': 'Generalmente respondo en 24-48 horas.',
  'contact.responseTime.urgent': 'Para urgencias, usa el email directo.',
  'contact.form.title': 'Envíame un Mensaje',
  'contact.help.title': '¿En qué puedo ayudarte?',
  'contact.help.cloud': 'Arquitectura Cloud (AWS)',
  'contact.help.kubernetes': 'Kubernetes & Contenedores',
  'contact.help.cicd': 'CI/CD & DevOps',
  'contact.help.apis': 'Desarrollo de APIs',
  'contact.help.consulting': 'Consultoría Técnica',
  'contact.help.mentoring': 'Mentoring & Coaching',

  // Projects page
  'projects.title': 'All My Projects',
  'projects.description':
    'All my project portfolio from real projects to open source projects.',
  'projects.subtitle':
    'Mi portafolio de proyectos comerciales y de código abierto.',
} as const;

export type TranslationKey = keyof typeof es;
