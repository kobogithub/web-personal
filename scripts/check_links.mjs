#!/usr/bin/env node
/**
 * Chequeo de enlaces internos sobre `dist/`.
 *
 * Existe por un bug que estuvo vivo varios meses sin que nadie lo notara: el
 * switcher de idioma armaba la URL de la contraparte agregando `/en` a la ruta
 * actual. Sirve para las páginas espejadas (`/about/` ↔ `/en/about/`), pero no
 * para los posts ni las fichas, cuya versión en inglés vive en otro slug
 * (`un-solo-interprete` ↔ `un-solo-interprete-en`). El sitio compilaba en
 * verde y publicaba 15 destinos rotos en 63 de 85 páginas.
 *
 * Un 404 interno no rompe el build de Astro: para el compilador un `href` es
 * una cadena. La única forma de verlo es mirar el sitio ya generado.
 *
 * Solo se validan los enlaces que arrancan con `/`. Los externos quedan afuera
 * a propósito: dependen de la red y volverían el chequeo intermitente.
 *
 *   node scripts/check_links.mjs [dist]
 *
 * Sale 1 si hay algún destino roto.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = process.argv[2] || 'dist';

if (!existsSync(DIST)) {
	console.error(`No existe "${DIST}/". Corré \`pnpm build\` primero.`);
	process.exit(1);
}

const pages = [];
const feeds = [];
(function walk(dir) {
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) walk(path);
		else if (entry.endsWith('.html')) pages.push(path);
		else if (entry === 'rss.xml') feeds.push(path);
	}
})(DIST);

// Un destino existe si resuelve a un archivo, a `<ruta>.html` o al `index.html`
// del directorio — las tres formas en las que Astro emite una página.
function resolves(url) {
	const clean = url.split('#')[0].split('?')[0];
	const path = join(DIST, decodeURIComponent(clean));
	return existsSync(path) || existsSync(`${path}.html`) || existsSync(join(path, 'index.html'));
}

function pageUrl(file) {
	return `/${relative(DIST, file)}`.replace(/index\.html$/, '').replace(/\.html$/, '/');
}

const broken = new Map();

function record(url, from) {
	if (!broken.has(url)) broken.set(url, new Set());
	broken.get(url).add(from);
}

for (const page of pages) {
	const html = readFileSync(page, 'utf8');
	for (const [, url] of html.matchAll(/href="(\/[^"]*)"/g)) {
		// `//host` es un enlace externo protocol-relative, no una ruta del sitio.
		if (url.startsWith('//')) continue;
		if (resolves(url)) continue;
		record(url, pageUrl(page));
	}
}

// Los feeds no son HTML y nadie los abre navegando, así que sus URLs se rompen
// sin que se note: uno llegó a publicar siete posts en rutas inexistentes. Se
// validan las que apuntan a este mismo sitio.
for (const feed of feeds) {
	const xml = readFileSync(feed, 'utf8');
	const site = xml.match(/<link>(https?:\/\/[^/]+)\//)?.[1];
	for (const [, link] of xml.matchAll(/<link>([^<]+)<\/link>/g)) {
		if (!site || !link.startsWith(site)) continue;
		const path = link.slice(site.length) || '/';
		if (resolves(path)) continue;
		record(path, `/${relative(DIST, feed)}`);
	}
}

if (broken.size === 0) {
	console.log(`OK — ${pages.length} páginas y ${feeds.length} feeds, ningún enlace interno roto.`);
	process.exit(0);
}

const affected = new Set([...broken.values()].flatMap((from) => [...from]));
for (const [url, from] of [...broken.entries()].sort()) {
	const sources = [...from].sort();
	const shown = sources.slice(0, 8).join(' ');
	console.error(`ROTO ${url}`);
	console.error(`  desde ${sources.length}: ${shown}${sources.length > 8 ? ' …' : ''}`);
}
console.error(`\n${broken.size} destinos rotos en ${affected.size} de ${pages.length} páginas.`);
process.exit(1);
