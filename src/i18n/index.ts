// Supported locales
export const languages = {
  es: 'Español',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'es';

// Extract language from URL
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) {
    return lang as Lang;
  }
  return defaultLang;
}

// Build localized path
export function linkFor(lang: Lang, path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For default language (Spanish), no prefix
  if (lang === defaultLang) {
    return `/${cleanPath}`;
  }
  
  // For other languages, add language prefix
  return `/${lang}/${cleanPath}`;
}

// UI translations
export const ui = {
  es: {
    'nav.home': 'Inicio',
    'nav.about': 'About',
    'nav.posts': 'Posts',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.tags': 'Tags',
    'nav.contact': 'Contacto',
    'site.title': 'Kevin Barroso',
    'site.tagline': 'WebPersonal con experiencias, habilidades y proyectos',
    'site.description': 'Blog Personal de Proyectos, Habilidades y experiencia laboral',
    // Header
    'header.switchLanguage': 'Cambiar idioma',
    'header.home': 'Inicio',
    'header.themeMode': 'Modo de tema',
    'header.siteLogo': 'Logo del sitio',
    'header.githubLogo': 'Logo de Github',
    // Footer
    'footer.copyright': 'Copyright © {year} Devolio.',
    'footer.templateCredit': 'Template creado por',
    // Table of Contents
    'toc.title': 'En esta página',
    // About the Author
    'author.title': 'Sobre el autor',
    'author.description': 'Kevin es un Arquitecto de Soluciones/SRE con experiencia en diseño, desarrollo e implementaciones en la nube de AWS.',
    // Blog post
    'post.publishedOn': 'Publicado el',
    'post.updatedOn': 'Actualizado el',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.posts': 'Posts',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.tags': 'Tags',
    'nav.contact': 'Contact',
    'site.title': 'Kevin Barroso',
    'site.tagline': 'Personal website with experiences, skills and projects',
    'site.description': 'Personal Blog of Projects, Skills and work experience',
    // Header
    'header.switchLanguage': 'Switch language',
    'header.home': 'Home',
    'header.themeMode': 'Theme mode',
    'header.siteLogo': 'Site logo',
    'header.githubLogo': 'Github logo',
    // Footer
    'footer.copyright': 'Copyright © {year} Devolio.',
    'footer.templateCredit': 'Template created by',
    // Table of Contents
    'toc.title': 'On This Page',
    // About the Author
    'author.title': 'About the Author',
    'author.description': 'Kevin is a Solutions Architect/SRE with experience in design, development and cloud implementations on AWS.',
    // Blog post
    'post.publishedOn': 'Published on',
    'post.updatedOn': 'Updated on',
  },
} as const;

type UiKey = keyof typeof ui[typeof defaultLang];

export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

// Get alternative language link
export function getAlternateLangLink(currentUrl: URL): string {
  const currentLang = getLangFromUrl(currentUrl);
  const alternateLang: Lang = currentLang === 'es' ? 'en' : 'es';
  
  // Get the path without the language prefix
  let path = currentUrl.pathname;
  
  // Remove current language prefix if it exists
  if (currentLang !== defaultLang) {
    path = path.replace(`/${currentLang}`, '');
  }
  
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  
  return linkFor(alternateLang, path);
}
