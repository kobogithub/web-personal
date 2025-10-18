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
		// URLs relativas son internas
		if (!url.startsWith('http')) {
			return false;
		}

		const urlObj = new URL(url);
		// Limpiar el dominio de protocolo y puerto
		const siteDomain = domain.replace(/^https?:\/\//, '').replace(/:\d+$/, '');

		// Comparar hostnames exactos para evitar bypass con dominios maliciosos
		// Ejemplo: kobouharriet.site.attacker.com NO será detectado como interno
		return urlObj.hostname !== siteDomain;
	} catch {
		// Si el URL es inválido, tratarlo como externo por seguridad
		return true;
	}
};
