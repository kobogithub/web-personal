import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { ui, type Lang } from '@src/i18n/index';
import { inLang } from '@src/utils';

/**
 * Constructor del feed, compartido por `/rss.xml` y `/en/rss.xml`.
 *
 * Hay un feed por idioma en vez de uno solo con todo. Antes había uno solo, y
 * como cada post existe dos veces (`index.md` e `index.en.md`), quien lo
 * seguía recibía cada artículo duplicado: una vez en español y otra en inglés,
 * sin forma de filtrar.
 *
 * El link se arma con el prefijo del idioma porque las dos versiones viven en
 * rutas distintas: `/{slug}/` para las de español, `/en/{slug-en}/` para las de
 * inglés.
 */
export async function buildFeed(context: { site?: URL | undefined }, lang: Lang) {
	const posts = inLang(await getCollection('blog'), lang).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
	);

	return rss({
		title: ui[lang]['site.title'],
		description: ui[lang]['site.description'],
		// El `<link>` del canal apunta al home del idioma del feed, no a la raíz
		// del sitio. Los links de cada item arrancan con `/`, así que se
		// resuelven contra el origen y no contra esto.
		site: new URL(lang === 'en' ? '/en/' : '/', context.site),
		// Los campos se listan uno por uno en vez de esparcir `post.data`: ahí
		// adentro hay cosas que no van en un feed (`seoTitle`, `alternate`, el
		// objeto de la portada) y terminaban filtrándose al XML.
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			categories: post.data.tags,
			link: lang === 'en' ? `/en/${post.id}/` : `/${post.id}/`,
		})),
		customData: `<language>${lang === 'en' ? 'en-us' : 'es'}</language>`,
	});
}
