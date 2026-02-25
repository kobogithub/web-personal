/**
 * English Translation Dictionary
 *
 * This file contains all English translations for the personal website.
 * If a key is missing here, the system will automatically fall back to
 * the Spanish translation.
 *
 * Keys should match those in es.ts:
 * - nav.* : Navigation menu items
 * - site.* : Site metadata (title, description, etc.)
 * - home.* : Home page content
 * - about.* : About page content
 * - contact.* : Contact page content
 * - projects.* : Projects page content
 */

export const en = {
  // Navigation
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.posts': 'Posts',
  'nav.projects': 'Projects',
  'nav.skills': 'Skills',
  'nav.tags': 'Tags',
  'nav.contact': 'Contact',

  // Site metadata
  'site.title': 'Kevin Barroso',
  'site.tagline': 'AI Engineer, Solutions Architect & Senior SRE',
  'site.description':
    'Personal blog about AI, Cloud, Kubernetes and Solutions Architecture experience',

  // Home page
  'home.greeting': 'Hello 👋, Kevin Barroso 👷',
  'home.intro.p1':
    'Solutions Architect/AI Engineer/Senior SRE with extensive experience in containers, cloud computing and artificial intelligence. I lead teams in implementing data architectures and AI systems, optimizing performance and scalability. Specialist in ECS/EKS service implementation and designing solutions based on LLMs, multi-agent systems and RAG.',
  'home.intro.p2':
    'My passion is creating robust and efficient systems that drive innovation, inspiring teams to achieve technical excellence. Expert in AWS, GCP, Azure ML, Kubernetes, CI/CD, LangChain/LangGraph, OpenAI, MCP and infrastructure automation. I excel at effective communication, solving complex problems and agile project management. University lecturer in AI Engineering and Intelligent Systems.',
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
  'about.taligent.position': 'Platform Manager',
  'about.taligent.period': 'November 2022 - Present',
  'about.freelance.position': 'Solutions Architect AWS + Developer',
  'about.freelance.period': 'February 2019 - November 2022',

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

  // Projects page
  'projects.title': 'All My Projects',
  'projects.description':
    'All my project portfolio from real projects to open source projects.',
  'projects.subtitle': 'My portfolio of commercial and open source projects.',
} as const;
