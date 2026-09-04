export const slugify = (input: string) => {
	if (!input) return '';

	// make lower case and trim
	var slug = input.toLowerCase().trim();

	// remove accents from charaters
	slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

	// replace invalid chars with spaces
	slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();

	// replace multiple spaces or hyphens with a single hyphen
	slug = slug.replace(/[\s-]+/g, '-');

	return slug;
};

export const unslugify = (slug: string) =>
	slug.replace(/\-/g, ' ').replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase());

// Un post existe dos veces, uno por idioma (`index.md` / `index.en.md`), y cada
// versión tiene su propio slug. Toda página que liste posts tiene que filtrar
// por idioma antes de armar los links: un post EN listado en una página ES
// termina en `/{slug-en}/`, que no existe — la ruta EN es `/en/{slug-en}/`.
//
// `lang` tiene default 'es' en el schema, pero se contempla el ausente para
// entradas viejas.
export const inLang = <T extends { data: { lang?: string } }>(posts: T[], lang: 'es' | 'en'): T[] =>
	posts.filter((post) => (post.data.lang ?? 'es') === lang);

export const kFormatter = (num: number) => {
	return Math.abs(num) > 999 ? (Math.sign(num) * (Math.abs(num) / 1000)).toFixed(1) + 'k' : Math.sign(num) * Math.abs(num);
};
