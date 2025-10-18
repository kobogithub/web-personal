import type { Lang } from './index';
import { t, type TranslationKey } from './index';

/**
 * @deprecated Use the new `t()` function from './index' instead
 * This function is kept for backward compatibility
 */
export function useContentTranslations(lang: Lang) {
  return function (key: TranslationKey): string {
    return t(lang, key);
  };
}

// Re-export for convenience
export { t };
