import { buildFeed } from '@src/feed';

// Feed en español. El de inglés vive en `/en/rss.xml`; la lógica común está en
// `src/feed.ts`.
export const GET = (context) => buildFeed(context, 'es');
