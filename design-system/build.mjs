// Build del paquete `magi-ds`.
//
// Tres salidas, todas bajo `dist/`:
//   - `index.js`    el bundle ESM de los componentes (react queda externo)
//   - `*.d.ts`      los tipos, que son el contrato que lee el agente de diseño
//   - `styles.css`  el CSS **ya compilado del sitio**, con las fuentes al lado
//
// Lo del CSS merece una nota. Los componentes usan clases de Tailwind, asi que
// el bundle necesita esas utilidades compiladas o las previews renderizan sin
// estilo. En vez de volver a correr Tailwind sobre este paquete —lo que daria
// una segunda fuente de verdad que se desincroniza— se toma el CSS que el
// sitio ya emitio en `dist/_astro/`: contiene las mismas utilidades, porque
// estos componentes son los del sitio, mas los tokens MAGI y las 12 clases
// propias. Las url() de las fuentes son absolutas (`/_astro/...`) y se
// reescriben a `./fonts/` para que resuelvan dentro del bundle.

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const dist = join(here, 'dist');
const require = createRequire(join(repoRoot, '.ds-sync', 'noop.js'));
const esbuild = require('esbuild');

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, 'fonts'), { recursive: true });

// 1. Bundle ---------------------------------------------------------------
await esbuild.build({
	entryPoints: [join(here, 'src', 'index.ts')],
	bundle: true,
	format: 'esm',
	target: 'es2020',
	jsx: 'automatic',
	outfile: join(dist, 'index.js'),
	external: ['react', 'react-dom', 'react/jsx-runtime'],
	logLevel: 'warning',
});
console.log('[build] dist/index.js');

// 2. Tipos ----------------------------------------------------------------
execFileSync(
	join(repoRoot, 'node_modules', '.bin', 'tsc'),
	['--project', join(here, 'tsconfig.json')],
	{ stdio: 'inherit' }
);
console.log('[build] dist/*.d.ts');

// 3. CSS + fuentes --------------------------------------------------------
const astroDir = join(repoRoot, 'dist', '_astro');
let cssFile;
try {
	cssFile = readdirSync(astroDir)
		.filter((f) => f.endsWith('.css'))
		.map((f) => ({ f, size: readFileSync(join(astroDir, f)).length }))
		.sort((a, b) => b.size - a.size)[0]?.f;
} catch {
	throw new Error(
		'No existe dist/_astro/. Compila el sitio primero con `pnpm run build` en la raiz.'
	);
}
if (!cssFile) throw new Error('No se encontro ningun .css en dist/_astro/.');

let css = readFileSync(join(astroDir, cssFile), 'utf8');

const fontRefs = new Set();
css = css.replace(/url\(\/_astro\/([^)]+\.(?:woff2|woff|ttf|otf))\)/g, (_m, file) => {
	fontRefs.add(file);
	return `url(./fonts/${file})`;
});

let copied = 0;
for (const file of fontRefs) {
	try {
		copyFileSync(join(astroDir, file), join(dist, 'fonts', basename(file)));
		copied++;
	} catch {
		console.warn(`[build] ! falta la fuente ${file}`);
	}
}

writeFileSync(join(dist, 'styles.css'), css);
console.log(`[build] dist/styles.css (desde ${cssFile}) + ${copied} fuentes`);
