/**
 * I18n System for the Personal Website
 *
 * Spanish (es) is the default language; English (en) falls back to Spanish for
 * any missing key. Translation keys are type-safe.
 *
 * ─── Where does a string live? ───────────────────────────────────────────────
 * Copy is split across exactly two modules, with no overlapping keys. Each key
 * exists in ONE place only — when editing copy, edit it there and nowhere else.
 *
 *   this file (`ui` / `useTranslations`)
 *     Site chrome, present on every page:
 *     nav.* · site.* · header.* · footer.* · toc.* · author.* · post.* · gate.*
 *
 *   ./translations (`translations` / `useContentTranslations`)
 *     Page body content:
 *     home.* · about.* · contact.* · contactForm.* · projects.* · skills.*
 *
 * Both dictionaries must keep es/en at parity. Do not reintroduce a third
 * dictionary: `es.ts` and `en.ts` were removed because they had silently
 * drifted out of sync with these two while being dead code.
 *
 * Usage:
 * ```typescript
 * import { useTranslations, getLangFromUrl } from '@src/i18n/index';
 *
 * const lang = getLangFromUrl(Astro.url);
 * const t = useTranslations(lang);
 * t('nav.home'); // 'Inicio' | 'Home'
 * ```
 */

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
    'site.tagline': 'Platform Manager, Arquitecto de Soluciones & AI Engineer',
    'site.description':
      'Blog personal de IA, Cloud, Kubernetes, plataformas de datos y experiencia en Arquitectura de Soluciones',
    // Header
    'header.switchLanguage': 'Cambiar idioma',
    'header.eyebrow': 'Platform Manager / AI Engineer',
    'header.home': 'Inicio',
    'header.themeMode': 'Modo de tema',
    'header.siteLogo': 'Logo del sitio',
    'header.githubLogo': 'Logo de Github',
    // Footer
    'footer.copyright': 'Copyright © {year}',
    'footer.signature': 'Diseñado y construido por',
    // Table of Contents
    'toc.title': 'En esta página',
    // About the Author
    'author.title': 'Sobre el autor',
    'author.description':
      'Kevin es Platform Manager y Arquitecto de Soluciones, con experiencia en plataformas de datos, sistemas agénticos y cloud computing en',
    // Blog post
    'post.publishedOn': 'Publicado el',
    'post.updatedOn': 'Actualizado el',
    // Entry gate
    'gate.eyebrow': 'MAGI SYSTEM // TERMINAL DE ACCESO',
    'gate.boot1': 'INICIANDO PROTOCOLO DE ACCESO...',
    'gate.boot2': 'VERIFICANDO CREDENCIALES...',
    'gate.boot3': 'ACCESO CONCEDIDO',
    'gate.title': 'ACCESO AL SISTEMA',
    'gate.subtitle': 'Kevin Barroso — Platform Manager / AI Engineer',
    'gate.enter': 'Entrar',
    'gate.hint': 'o presioná Enter',
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
    'site.tagline': 'Platform Manager, Solutions Architect & AI Engineer',
    'site.description':
      'Personal blog about AI, Cloud, Kubernetes, data platforms and Solutions Architecture experience',
    // Header
    'header.switchLanguage': 'Switch language',
    'header.eyebrow': 'Platform Manager / AI Engineer',
    'header.home': 'Home',
    'header.themeMode': 'Theme mode',
    'header.siteLogo': 'Site logo',
    'header.githubLogo': 'Github logo',
    // Footer
    'footer.copyright': 'Copyright © {year}',
    'footer.signature': 'Designed and built by',
    // Table of Contents
    'toc.title': 'On This Page',
    // About the Author
    'author.title': 'About the Author',
    'author.description':
      'Kevin is a Platform Manager and Solutions Architect, with experience in data platforms, agentic systems and cloud computing on',
    // Blog post
    'post.publishedOn': 'Published on',
    'post.updatedOn': 'Updated on',
    // Entry gate
    'gate.eyebrow': 'MAGI SYSTEM // ACCESS TERMINAL',
    'gate.boot1': 'INITIATING ACCESS PROTOCOL...',
    'gate.boot2': 'VERIFYING CREDENTIALS...',
    'gate.boot3': 'ACCESS GRANTED',
    'gate.title': 'SYSTEM ACCESS',
    'gate.subtitle': 'Kevin Barroso — Platform Manager / AI Engineer',
    'gate.enter': 'Enter',
    'gate.hint': 'or press Enter',
  },
} as const;

type UiKey = keyof (typeof ui)[typeof defaultLang];

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

// Save language preference to localStorage
export function saveLanguagePreference(lang: Lang): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('lang', lang);
  }
}

// Get language preference from localStorage
export function getLanguagePreference(): Lang | null {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('lang');
    if (stored && stored in languages) {
      return stored as Lang;
    }
  }
  return null;
}
