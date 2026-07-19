import { getRepositoryDetails } from '../../utils';

export interface BilingualText {
  es: string;
  en: string;
}

export interface Project {
  id: string;
  name: BilingualText;
  description: BilingualText;
  demoLink: string;
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
    demoLink: 'https://github.com/kobogithub',
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
    demoLink: 'https://github.com/kobogithub',
    tags: ['AI', 'NLP', 'FastAPI'],
  },
  {
    id: 'proj-4',
    name: {
      es: 'Knowledge Framework',
      en: 'Knowledge Framework',
    },
    description: {
      es: 'Framework multi-agente para desarrollo asistido por IA con MCP y 8+ agentes especializados',
      en: 'Multi-agent framework for AI-assisted development with MCP and 8+ specialized agents',
    },
    demoLink: 'https://github.com/kobogithub',
    tags: ['AI', 'Multi-Agent', 'MCP'],
  },
  {
    id: 'proj-5',
    name: {
      es: 'Knowledge CLI',
      en: 'Knowledge CLI',
    },
    description: {
      es: 'CLI en Rust para desarrollo asistido por IA con gestión de agentes y skills',
      en: 'Rust CLI for AI-assisted development with agent and skills management',
    },
    demoLink: 'https://github.com/kobogithub',
    tags: ['Rust', 'AI', 'CLI'],
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
    demoLink: 'https://github.com/kobogithub',
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
  // {
  //   ...(await getRepositoryDetails('syakirurahman/organization-tree')),
  //   name: 'Organization tree',
  //   demoLink: 'https://organization-tree-2a446.web.app/',
  //   tags: ['Hobby']
  // }
];
