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
