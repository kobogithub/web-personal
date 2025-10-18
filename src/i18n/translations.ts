import type { Lang } from './index';

export const translations = {
  es: {
    // Home page
    'home.greeting': 'Hola 👋, Kevin Barroso 👷',
    'home.intro.p1': 'Arquitecto de Soluciones/SRE Ssr con amplia experiencia en contenedores y cloud computing. Lidero equipos en la implementación de arquitecturas de datos, optimizando el rendimiento y la escalabilidad. Implementacion de servicios en arquitecturas ECS. Construcción, desarrollo e implementacion de arquitecturas Kubernetes en EKS.',
    'home.intro.p2': 'Mi pasión es crear sistemas robustos y eficientes que impulsen la innovación, inspirando a los equipos a alcanzar la excelencia técnica. Ssr en AWS, Kubernetes, CI/CD, seguridad en la nube y automatización de infraestructura. Destaco por mi comunicación efectiva, resolución de problemas complejos y gestión de proyectos ágiles.',
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
    'about.taligent.position': 'Líder Técnico - Ingeniería de Datos',
    'about.taligent.period': 'Noviembre 2022 - Presente',
    'about.freelance.position': 'Solutions Architect AWS + Developer',
    'about.freelance.period': 'Febrero 2019 - Noviembre 2022',
    
    // Contact page
    'contact.title': 'Contacto',
    'contact.description': 'Ponte en contacto conmigo para proyectos, colaboraciones o consultas',
    'contact.intro.p1': '¡Me encantaría saber de ti! Si tienes algún proyecto interesante, una propuesta de colaboración, o simplemente quieres conectar, no dudes en enviarme un mensaje.',
    'contact.intro.p2': 'Ya sea que necesites ayuda con arquitectura cloud, desarrollo de aplicaciones, o consultoria técnica, estoy aquí para ayudarte a hacer realidad tus ideas.',
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
    'projects.description': 'All my project portfolio from real projects to open source projects.',
    'projects.subtitle': 'Mi portafolio de proyectos comerciales y de código abierto.',
  },
  en: {
    // Home page
    'home.greeting': 'Hello 👋, Kevin Barroso 👷',
    'home.intro.p1': 'Senior Solutions Architect/SRE with extensive experience in containers and cloud computing. I lead teams in implementing data architectures, optimizing performance and scalability. Service implementation in ECS architectures. Construction, development and implementation of Kubernetes architectures in EKS.',
    'home.intro.p2': 'My passion is creating robust and efficient systems that drive innovation, inspiring teams to achieve technical excellence. Senior in AWS, Kubernetes, CI/CD, cloud security and infrastructure automation. I excel at effective communication, solving complex problems and agile project management.',
    'home.recentPosts': 'Recent Posts',
    'home.myProjects': 'My Projects',
    'home.mySkills': 'My Skills',
    'home.allPosts': 'All posts',
    'home.allProjects': 'All projects',
    'home.allSkills': 'All skills',
    
    // About page
    'about.title': 'About me',
    'about.description': 'Summary of experiences to date',
    'about.workExperience': 'Professional Experience',
    'about.taligent.position': 'Technical Lead - Data Engineering',
    'about.taligent.period': 'November 2022 - Present',
    'about.freelance.position': 'Solutions Architect AWS + Developer',
    'about.freelance.period': 'February 2019 - November 2022',
    
    // Contact page
    'contact.title': 'Contact',
    'contact.description': 'Get in touch with me for projects, collaborations or inquiries',
    'contact.intro.p1': 'I\'d love to hear from you! If you have an interesting project, a collaboration proposal, or just want to connect, don\'t hesitate to send me a message.',
    'contact.intro.p2': 'Whether you need help with cloud architecture, application development, or technical consulting, I\'m here to help you bring your ideas to life.',
    'contact.email.title': 'Direct Email',
    'contact.email.text': 'If you prefer to write me directly:',
    'contact.responseTime.title': 'Response Time',
    'contact.responseTime.text': 'I generally respond within 24-48 hours.',
    'contact.responseTime.urgent': 'For urgent matters, use direct email.',
    'contact.form.title': 'Send Me a Message',
    'contact.help.title': 'How can I help you?',
    'contact.help.cloud': 'Cloud Architecture (AWS)',
    'contact.help.kubernetes': 'Kubernetes & Containers',
    'contact.help.cicd': 'CI/CD & DevOps',
    'contact.help.apis': 'API Development',
    'contact.help.consulting': 'Technical Consulting',
    'contact.help.mentoring': 'Mentoring & Coaching',
    
    // Projects page
    'projects.title': 'All My Projects',
    'projects.description': 'All my project portfolio from real projects to open source projects.',
    'projects.subtitle': 'My portfolio of commercial and open source projects.',
  },
} as const;

type TranslationKey = keyof typeof translations[typeof import('./index').defaultLang];

export function useContentTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return translations[lang][key] || translations['es'][key];
  };
}
