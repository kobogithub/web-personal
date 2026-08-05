/**
 * Page body content translations.
 *
 * Scope: home.* · about.* · contact.* · contactForm.* · projects.* · skills.*
 * Site chrome (nav, site metadata, header, footer, author, gate) lives in
 * `./index` instead. See the header of that file for the full split.
 *
 * `es` is the source of truth for the key set — `en` must define the same keys.
 */

import type { Lang } from './index';
import { defaultLang } from './index';

/**
 * Bio paragraphs shared verbatim by the home and about pages.
 *
 * `home.intro.*` and `about.intro.*` are kept as separate keys so either page
 * can diverge later, but while the text is identical it is defined once here.
 * Edit the bio in these constants — not at the four key sites below.
 */
const BIO_P1 = {
  es: 'Arquitecto de Soluciones/AI Engineer/SRE Ssr con amplia experiencia en contenedores, cloud computing e inteligencia artificial. Lidero equipos en la implementación de arquitecturas de datos y sistemas de IA, optimizando el rendimiento y la escalabilidad. Especialista en implementación de servicios en arquitecturas ECS/EKS y diseño de soluciones basadas en LLMs, sistemas multi-agente y RAG.',
  en: 'Solutions Architect/AI Engineer/Senior SRE with extensive experience in containers, cloud computing and artificial intelligence. I lead teams in implementing data architectures and AI systems, optimizing performance and scalability. Specialist in ECS/EKS service implementation and designing solutions based on LLMs, multi-agent systems and RAG.',
};

const BIO_P2 = {
  es: 'Mi pasión es crear sistemas robustos y eficientes que impulsen la innovación, inspirando a los equipos a alcanzar la excelencia técnica. Experto en AWS, GCP, Azure ML, Kubernetes, CI/CD, LangChain/LangGraph, OpenAI, MCP y automatización de infraestructura. Destaco por mi comunicación efectiva, resolución de problemas complejos y gestión de proyectos ágiles. Docente universitario en Ingeniería de IA y Sistemas Inteligentes.',
  en: 'My passion is creating robust and efficient systems that drive innovation, inspiring teams to achieve technical excellence. Expert in AWS, GCP, Azure ML, Kubernetes, CI/CD, LangChain/LangGraph, OpenAI, MCP and infrastructure automation. I excel at effective communication, solving complex problems and agile project management. University lecturer in AI Engineering and Intelligent Systems.',
};

export const translations = {
  es: {
    // Home page
    'home.greeting': 'Hola 👋, Kevin Barroso 👷',
    'home.intro.p1': BIO_P1.es,
    'home.intro.p2': BIO_P2.es,
    'home.recentPosts': 'Recent Posts',
    'home.myProjects': 'My Projects',
    'home.mySkills': 'My Skills',
    'home.allPosts': 'All posts',
    'home.allProjects': 'All projects',
    'home.allSkills': 'All skills',

    // About page
    'about.title': 'Sobre mí',
    'about.description': 'Resumen de experiencias hasta la actualidad',
    'about.greeting': 'Hola 👋, Kevin Barroso 👷',
    'about.intro.p1': BIO_P1.es,
    'about.intro.p2': BIO_P2.es,
    'about.workExperience': 'Experiencia Profesional',
    'about.taligent.position': 'Platform Manager',
    'about.taligent.period': 'Noviembre 2022 - Presente',
    'about.taligent.task1':
      'Diseño e implementación de arquitecturas de datos avanzadas, desarrollando soluciones robustas en AWS y SAP',
    'about.taligent.task2':
      'Optimización del rendimiento y escalabilidad de sistemas críticos en entornos cloud',
    'about.taligent.task3':
      'Diseño, desarrollo e implementación de arquitectura ECS, utilizando servicios Fargate y Auto Scaling de EC2',
    'about.taligent.task4':
      'Construcción y ejecución exitosa del plan de migración de servicios desde ECS hacia EKS',
    'about.taligent.task5':
      'Implementación de pipelines de CI/CD mediante GitHub Actions, AWS CodePipeline y Concourse CI',
    'about.taligent.task6':
      'Liderazgo de equipos en la implementación de Arquitecturas de datos',
    'about.taligent.task7':
      'Optimización de costos e infraestructura en entornos cloud',
    'about.taligent.task8':
      'Desarrollo de agentes de IA para procesamiento inteligente de documentos con OpenAI GPT-4o, AWS Textract y LangChain/LangGraph',
    'about.taligent.task9':
      'Diseño e implementación de sistemas multi-agente con Model Context Protocol (MCP) para automatización de flujos de trabajo',
    'about.taligent.task10':
      'Construcción de pipelines de NLP y OCR para extracción inteligente de datos de mensajes de WhatsApp y comprobantes',
    'about.taligent.task11':
      'Implementación de prompt engineering con templates versionados y métricas de tokens',
    'about.taligent.task12':
      'Liderazgo del programa de adopción de IA en la organización, incluyendo capacitación y evaluación de herramientas',
    'about.taligent.task13':
      'Desarrollo de plataforma de datos con DuckDB, Streamlit y workflows asistidos por IA',
    'about.taligent.task14':
      'Diseño de infraestructura cloud para servicios de IA en AWS (ECS/Fargate + OpenAI) y GCP (BigQuery, Cloud Functions, Cloud Run)',
    'about.taligent.task15':
      'Desarrollo de framework CLI en Rust para desarrollo asistido por IA con gestión de agentes y skills',
    'about.freelance.position': 'Solutions Architect AWS + Developer',
    'about.freelance.period': 'Febrero 2019 - Noviembre 2022',
    'about.freelance.task1':
      'Diseño e implementación de arquitecturas robustas para web hosting y microservicios',
    'about.freelance.task2':
      'Implementación de soluciones de seguridad para contenedores en ECS',
    'about.freelance.task3':
      'Desarrollo de sistemas de monitoreo avanzados con Grafana, Prometheus y Fluentd',
    'about.freelance.task4':
      'Desarrollo e implementación de arquitecturas de orquestación con Apache Airflow en AutoScaling y MWAA',
    'about.freelance.task5':
      'Desarrollo de microservicios y APIs con frameworks de Python',
    'about.freelance.task6':
      'Construcción de soluciones dockerizadas para aplicaciones monolíticas y microservicios',
    'about.freelance.task7':
      'Diseño e implementación de arquitecturas serverless con AWS Lambda y AWS SAM',
    'about.freelance.task8':
      'Desarrollo de infraestructura como código utilizando Terraform',
    'about.freelance.task9':
      'Integración de servicios AWS para soluciones cloud escalables y complejas',
    'about.freelance.task10':
      'Diseño e implementación de Data Lakes con arquitectura medallion (bronze/silver/diamond) usando AWS Glue, S3 y Jupyter Notebooks',
    'about.teaching': 'Docencia',
    'about.utn.position': 'Docente de Ingeniería de IA y Sistemas Inteligentes',
    'about.utn.company': 'Universidad Tecnológica Nacional - Rosario',
    'about.utn.period': 'Enero 2024 - Presente',
    'about.utn.summary':
      'Programa intensivo de 33 horas enfocado en Agentic AI Engineering, Vibe Engineering y desarrollo de sistemas complejos, con aplicaciones en agroindustria, bienestar social y economías dinámicas.',
    'about.utn.task1':
      "Diseño e impartición del programa 'Análisis de Datos, Ingeniería de IA y Sistemas Inteligentes (Nivel 1)'",
    'about.utn.task2':
      'Cobertura de Modern Python Stack, Machine Learning, NLP, Computer Vision y Sistemas Agénticos (MCP)',
    'about.utn.task3':
      'Enseñanza de MLOps, RAG (Retrieval-Augmented Generation), Vector Databases y Cloud Deploy',
    'about.utn.task4':
      'Stack tecnológico: Python 3.12+, Docker, AWS/Google Cloud, Transformers, Streamlit, PostgreSQL',
    'about.certifications': 'Certificaciones',
    'about.cert.aws.title': 'AWS Certified Solutions Architect – Associate',
    'about.cert.aws.issuer': 'Amazon Web Services',
    'about.cert.aws.date': 'Octubre 13, 2028',
    'about.cert.verify': 'Verificar certificación',

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
    'contact.help.ai': 'Inteligencia Artificial & LLMs',
    'contact.help.data': 'Data Engineering & Analytics',

    // Contact form
    'contactForm.label.name': 'Nombre',
    'contactForm.label.email': 'Email',
    'contactForm.label.subject': 'Asunto',
    'contactForm.label.message': 'Mensaje',
    'contactForm.placeholder.name': 'Tu nombre',
    'contactForm.placeholder.email': 'tu@email.com',
    'contactForm.placeholder.subject': '¿De qué quieres hablar?',
    'contactForm.placeholder.message': 'Escribe tu mensaje aquí...',
    'contactForm.button.submit': 'Enviar Mensaje',
    'contactForm.button.submitting': 'Enviando...',
    'contactForm.button.cooldown': 'Espera {seconds}s',
    'contactForm.error.nameRequired': 'El nombre es obligatorio',
    'contactForm.error.nameMaxLength':
      'El nombre no puede exceder {max} caracteres',
    'contactForm.error.emailRequired': 'El email es obligatorio',
    'contactForm.error.emailMaxLength':
      'El email no puede exceder {max} caracteres',
    'contactForm.error.emailInvalid': 'El email no es válido',
    'contactForm.error.subjectRequired': 'El asunto es obligatorio',
    'contactForm.error.subjectMaxLength':
      'El asunto no puede exceder {max} caracteres',
    'contactForm.error.messageRequired': 'El mensaje es obligatorio',
    'contactForm.error.messageMinLength':
      'El mensaje debe tener al menos {min} caracteres',
    'contactForm.error.messageMaxLength':
      'El mensaje no puede exceder {max} caracteres',
    'contactForm.message.success':
      '¡Mensaje enviado con éxito! Te responderé pronto.',
    'contactForm.message.error':
      'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.',
    'contactForm.message.cooldown':
      'Por favor espera {seconds} segundos antes de enviar otro mensaje.',

    // Projects page
    'projects.title': 'All My Projects',
    'projects.description':
      'All my project portfolio from real projects to open source projects.',
    'projects.subtitle':
      'Mi portafolio de proyectos comerciales y de código abierto.',

    // Skills page
    'skills.title': 'All My Skills',
    'skills.description': 'All my skills',
    'skills.subtitle':
      'Habilidades Blandas y duras a lo largo de mi experiencia.',
  },
  en: {
    // Home page
    'home.greeting': 'Hello 👋, Kevin Barroso 👷',
    'home.intro.p1': BIO_P1.en,
    'home.intro.p2': BIO_P2.en,
    'home.recentPosts': 'Recent Posts',
    'home.myProjects': 'My Projects',
    'home.mySkills': 'My Skills',
    'home.allPosts': 'All posts',
    'home.allProjects': 'All projects',
    'home.allSkills': 'All skills',

    // About page
    'about.title': 'About me',
    'about.description': 'Summary of experiences to date',
    'about.greeting': 'Hello 👋, Kevin Barroso 👷',
    'about.intro.p1': BIO_P1.en,
    'about.intro.p2': BIO_P2.en,
    'about.workExperience': 'Professional Experience',
    'about.taligent.position': 'Platform Manager',
    'about.taligent.period': 'November 2022 - Present',
    'about.taligent.task1':
      'Design and implementation of advanced data architectures, developing robust solutions in AWS and SAP',
    'about.taligent.task2':
      'Performance optimization and scalability of critical systems in cloud environments',
    'about.taligent.task3':
      'Design, development and implementation of ECS architecture, using Fargate services and EC2 Auto Scaling',
    'about.taligent.task4':
      'Construction and successful execution of the service migration plan from ECS to EKS',
    'about.taligent.task5':
      'Implementation of CI/CD pipelines through GitHub Actions, AWS CodePipeline and Concourse CI',
    'about.taligent.task6':
      'Team leadership in implementing data architectures',
    'about.taligent.task7':
      'Cost and infrastructure optimization in cloud environments',
    'about.taligent.task8':
      'Development of AI agents for intelligent document processing with OpenAI GPT-4o, AWS Textract and LangChain/LangGraph',
    'about.taligent.task9':
      'Design and implementation of multi-agent systems with Model Context Protocol (MCP) for workflow automation',
    'about.taligent.task10':
      'Building NLP and OCR pipelines for intelligent data extraction from WhatsApp messages and receipts',
    'about.taligent.task11':
      'Implementation of prompt engineering with versioned templates and token metrics',
    'about.taligent.task12':
      'Leadership of AI adoption program in the organization, including training and tool evaluation',
    'about.taligent.task13':
      'Development of data platform with DuckDB, Streamlit and AI-assisted workflows',
    'about.taligent.task14':
      'Cloud infrastructure design for AI services on AWS (ECS/Fargate + OpenAI) and GCP (BigQuery, Cloud Functions, Cloud Run)',
    'about.taligent.task15':
      'Development of CLI framework in Rust for AI-assisted development with agent and skills management',
    'about.freelance.position': 'Solutions Architect AWS + Developer',
    'about.freelance.period': 'February 2019 - November 2022',
    'about.freelance.task1':
      'Design and implementation of robust architectures for web hosting and microservices',
    'about.freelance.task2':
      'Implementation of security solutions for containers in ECS',
    'about.freelance.task3':
      'Development of advanced monitoring systems with Grafana, Prometheus and Fluentd',
    'about.freelance.task4':
      'Development and implementation of orchestration architectures with Apache Airflow in AutoScaling and MWAA',
    'about.freelance.task5':
      'Development of microservices and APIs with Python frameworks',
    'about.freelance.task6':
      'Building dockerized solutions for monolithic applications and microservices',
    'about.freelance.task7':
      'Design and implementation of serverless architectures with AWS Lambda and AWS SAM',
    'about.freelance.task8':
      'Infrastructure as code development using Terraform',
    'about.freelance.task9':
      'Integration of AWS services for scalable and complex cloud solutions',
    'about.freelance.task10':
      'Design and implementation of Data Lakes with medallion architecture (bronze/silver/diamond) using AWS Glue, S3 and Jupyter Notebooks',
    'about.teaching': 'Teaching',
    'about.utn.position': 'Lecturer in AI Engineering and Intelligent Systems',
    'about.utn.company': 'Universidad Tecnológica Nacional - Rosario',
    'about.utn.period': 'January 2024 - Present',
    'about.utn.summary':
      'Intensive 33-hour program focused on Agentic AI Engineering, Vibe Engineering and complex systems development, with applications in agroindustry, social welfare and dynamic economies.',
    'about.utn.task1':
      "Design and delivery of the program 'Data Analysis, AI Engineering and Intelligent Systems (Level 1)'",
    'about.utn.task2':
      'Coverage of Modern Python Stack, Machine Learning, NLP, Computer Vision and Agentic Systems (MCP)',
    'about.utn.task3':
      'Teaching MLOps, RAG (Retrieval-Augmented Generation), Vector Databases and Cloud Deploy',
    'about.utn.task4':
      'Tech stack: Python 3.12+, Docker, AWS/Google Cloud, Transformers, Streamlit, PostgreSQL',
    'about.certifications': 'Certifications',
    'about.cert.aws.title': 'AWS Certified Solutions Architect – Associate',
    'about.cert.aws.issuer': 'Amazon Web Services',
    'about.cert.aws.date': 'October 13, 2028',
    'about.cert.verify': 'Verify certification',

    // Contact page
    'contact.title': 'Contact',
    'contact.description':
      'Get in touch with me for projects, collaborations or inquiries',
    'contact.intro.p1':
      "I'd love to hear from you! If you have an interesting project, a collaboration proposal, or just want to connect, don't hesitate to send me a message.",
    'contact.intro.p2':
      "Whether you need help with cloud architecture, application development, or technical consulting, I'm here to help you bring your ideas to life.",
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
    'contact.help.ai': 'Artificial Intelligence & LLMs',
    'contact.help.data': 'Data Engineering & Analytics',

    // Contact form
    'contactForm.label.name': 'Name',
    'contactForm.label.email': 'Email',
    'contactForm.label.subject': 'Subject',
    'contactForm.label.message': 'Message',
    'contactForm.placeholder.name': 'Your name',
    'contactForm.placeholder.email': 'your@email.com',
    'contactForm.placeholder.subject': 'What would you like to talk about?',
    'contactForm.placeholder.message': 'Write your message here...',
    'contactForm.button.submit': 'Send Message',
    'contactForm.button.submitting': 'Sending...',
    'contactForm.button.cooldown': 'Wait {seconds}s',
    'contactForm.error.nameRequired': 'Name is required',
    'contactForm.error.nameMaxLength': 'Name cannot exceed {max} characters',
    'contactForm.error.emailRequired': 'Email is required',
    'contactForm.error.emailMaxLength': 'Email cannot exceed {max} characters',
    'contactForm.error.emailInvalid': 'Email is not valid',
    'contactForm.error.subjectRequired': 'Subject is required',
    'contactForm.error.subjectMaxLength':
      'Subject cannot exceed {max} characters',
    'contactForm.error.messageRequired': 'Message is required',
    'contactForm.error.messageMinLength':
      'Message must be at least {min} characters',
    'contactForm.error.messageMaxLength':
      'Message cannot exceed {max} characters',
    'contactForm.message.success':
      "Message sent successfully! I'll respond soon.",
    'contactForm.message.error':
      'There was an error sending the message. Please try again.',
    'contactForm.message.cooldown':
      'Please wait {seconds} seconds before sending another message.',

    // Projects page
    'projects.title': 'All My Projects',
    'projects.description':
      'All my project portfolio from real projects to open source projects.',
    'projects.subtitle': 'My portfolio of commercial and open source projects.',

    // Skills page
    'skills.title': 'My Skills',
    'skills.description': 'All my technical skills and competencies',
    'skills.subtitle':
      "Technical skills and competencies I've developed throughout my career.",
  },
} as const;

type TranslationKey = keyof (typeof translations)[typeof defaultLang];

export type { TranslationKey };

export function useContentTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return translations[lang][key] || translations['es'][key];
  };
}
