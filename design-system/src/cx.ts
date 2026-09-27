/**
 * Une clases condicionalmente. Es el equivalente en React de `class:list` de
 * Astro, que es lo que usaban los componentes originales: acepta strings,
 * `undefined`/`false` (se descartan) y objetos `{clase: condicion}`.
 */
export type ClassValue =
	| string
	| false
	| null
	| undefined
	| Record<string, boolean | undefined>;

export function cx(...values: ClassValue[]): string {
	const out: string[] = [];
	for (const value of values) {
		if (!value) continue;
		if (typeof value === 'string') {
			out.push(value);
			continue;
		}
		for (const [cls, on] of Object.entries(value)) {
			if (on) out.push(cls);
		}
	}
	return out.join(' ');
}
