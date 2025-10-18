/**
 * I18n System for the Personal Website
 * 
 * This module provides a typed internationalization system with support for:
 * - Spanish (es) as the default language
 * - English (en) as an alternative language
 * - Type-safe translation keys
 * - Parameter interpolation in translation strings
 * - Automatic fallback from English to Spanish for missing keys
 * 
 * Usage Examples:
 * ```typescript
 * import { t, DEFAULT_LANG, type Lang } from '@src/i18n';
 * 
 * // Basic translation
 * const homeText = t('es', 'nav.home'); // 'Inicio'
 * const homeTextEn = t('en', 'nav.home'); // 'Home'
 * 
 * // With parameter interpolation (when keys have {param} syntax)
 * const greeting = t('es', 'greeting.name', { name: 'John' }); // 'Hola John'
 * 
 * // Use DEFAULT_LANG constant
 * const text = t(DEFAULT_LANG, 'nav.home'); // 'Inicio'
 * ```
 */

import { es, type TranslationKey } from './es';
import { en } from './en';

// Re-export TranslationKey for easier imports
export type { TranslationKey };

// Supported locales
export const languages = {
  es: 'Español',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const DEFAULT_LANG: Lang = 'es';

// Dictionaries
const dictionaries = {
  es,
  en,
} as const;

/**
 * Translation function with parameter interpolation support
 * @param lang - Language code ('es' | 'en')
 * @param key - Translation key (e.g., 'nav.home', 'contact.title')
 * @param params - Optional parameters for string interpolation
 * @returns Translated string with interpolated parameters
 * 
 * @example
 * t('es', 'nav.home') // 'Inicio'
 * t('en', 'nav.home') // 'Home'
 * t('en', 'greeting', { name: 'John' }) // if key is 'Hello {name}' -> 'Hello John'
 */
export function t(
  lang: Lang,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  // Get translation from the specified language, fallback to default language (Spanish)
  let translation: string = dictionaries[lang][key] || dictionaries[DEFAULT_LANG][key];
  
  // Final fallback if key doesn't exist in any dictionary (shouldn't happen with typed keys)
  if (!translation) {
    console.warn(`Missing translation for key: ${key}`);
    return `[${key}]`;
  }
  
  // If params are provided, interpolate them
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      translation = translation.replace(
        new RegExp(`\\{${paramKey}\\}`, 'g'),
        String(paramValue)
      );
    });
  }
  
  return translation;
}

// Extract language from URL
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) {
    return lang as Lang;
  }
  return DEFAULT_LANG;
}

// Build localized path
export function linkFor(lang: Lang, path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For default language (Spanish), no prefix
  if (lang === DEFAULT_LANG) {
    return `/${cleanPath}`;
  }
  
  // For other languages, add language prefix
  return `/${lang}/${cleanPath}`;
}

// Get alternative language link
export function getAlternateLangLink(currentUrl: URL): string {
  const currentLang = getLangFromUrl(currentUrl);
  const alternateLang: Lang = currentLang === 'es' ? 'en' : 'es';
  
  // Get the path without the language prefix
  let path = currentUrl.pathname;
  
  // Remove current language prefix if it exists
  if (currentLang !== DEFAULT_LANG) {
    path = path.replace(`/${currentLang}`, '');
  }
  
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  
  return linkFor(alternateLang, path);
}

// Legacy compatibility: keep old API for gradual migration
export const defaultLang = DEFAULT_LANG;

export const ui = dictionaries;

export function useTranslations(lang: Lang) {
  return function (key: TranslationKey): string {
    return t(lang, key);
  };
}
