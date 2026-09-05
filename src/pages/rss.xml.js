import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		// El feed lleva las dos versiones de cada post, y cada una vive en su
		// propia ruta: las de inglés cuelgan de `/en/`. Armar el link solo con
		// el id publicaba `/{slug-en}/`, que no existe.
		items: posts.map((post) => ({
			...post.data,
			link: post.data.lang === 'en' ? `/en/${post.id}/` : `/${post.id}/`,
		})),
	});
}
