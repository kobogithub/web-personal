import { buildFeed } from '@src/feed';

// Feed en inglés. Ver la nota en `src/feed.ts` sobre por qué hay uno por idioma.
export const GET = (context) => buildFeed(context, 'en');
