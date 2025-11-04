import type { RehypePlugin } from '@astrojs/markdown-remark';
import { visit } from 'unist-util-visit';

interface Options {
	domain: string;
}

export const autoNewTabExternalLinks: RehypePlugin = (options?: Options) => {
	const siteDomain = options?.domain ?? '';

	return (tree: unknown) => {
		visit(tree, (node: any) => {
			if (node.type != 'element') {
				return;
			}

			const element = node;

			if (!isAnchor(element)) {
				return;
			}

			const url = getUrl(element);

			if (isExternal(url, siteDomain)) {
				element.properties!['target'] = '_blank';
				element.properties!['rel'] = 'noopener';
			}
		});
	};
};

const isAnchor = (element: any) => element.tagName == 'a' && element.properties && 'href' in element.properties;

const getUrl = (element: any) => {
	if (!element.properties) {
		return '';
	}

	const url = element.properties['href'];

	if (!url) {
		return '';
	}

	return url.toString();
};

const isExternal = (url: string, domain: string) => {
	try {
		// URLs relativas son internas, pero protocol-relative URLs (//) son externas
		if (!url.startsWith('http') && !url.startsWith('//')) {
			return false;
		}

		const urlObj = new URL(url, 'http://dummy.local');
		// Extraer solo el hostname del dominio configurado
		// Manejar casos: "localhost:4321", "https://kobouharriet.site", "kobouharriet.site"
		const siteDomain = domain.replace(/^https?:\/\//, '').split(':')[0];

		// Comparar hostnames exactos para evitar bypass con dominios maliciosos
		// Ejemplo: kobouharriet.site.attacker.com NO será detectado como interno
		return urlObj.hostname !== siteDomain;
	} catch {
		// Si el URL es inválido, tratarlo como externo por seguridad
		return true;
	}
};
