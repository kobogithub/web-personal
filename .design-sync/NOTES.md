# design-sync — notas de este repo

## Qué es este paquete y por qué existe

`design-system/` es un paquete React creado **para este sync**, no una librería que el
sitio use. El sitio es Astro: sus componentes visuales son `.astro` y compilan a HTML
en build time, así que no existen en runtime y Claude Design no puede instanciarlos.
Los 14 `.astro` se portaron a React y se sumaron los 3 `.tsx` que ya existían.

**La deuda que esto crea, dicha en voz alta:** `design-system/src/components/*.tsx` y
`src/components/*.astro` son dos copias del mismo diseño. Si se edita un `.astro` y no
su par en React, el design system queda mintiendo. Kevin lo decidió sabiendo esto
(27-sep-2026); la alternativa que se le ofreció era sincronizar sólo los tokens.

## La restricción más importante: el CSS es el del sitio

`design-system/build.mjs` **no corre Tailwind**. Toma el `.css` más grande que el sitio
ya emitió en `dist/_astro/` y lo copia como `styles.css` del paquete, reescribiendo las
`url()` de las fuentes de `/_astro/` a `./fonts/`.

Se hizo así a propósito: correr Tailwind sobre el paquete daría una segunda fuente de
verdad que se desincroniza del sitio. La contra es una regla dura:

> **Una preview sólo puede usar clases que el sitio ya compiló.**

Costó un ciclo de depuración: `h-[520px]`, `max-w-md`, `max-w-xs` e `items-end` no
existen en el CSS del sitio y las previews salían rotas (EntryGate medía 2px de alto).
La solución fue `style={{ ... }}` inline para el andamiaje de layout. Las clases de los
componentes nunca dan problema — vienen del sitio.

**Antes de compilar el paquete hay que compilar el sitio** (`pnpm run build` en la raíz),
o `build.mjs` falla con "No existe dist/_astro/".

## Cambios de API respecto de los `.astro`

Los originales leen del i18n del sitio y de sus colecciones de contenido. Un componente
de design system no puede depender de esos singletons, así que:

- Los textos son props con valores por defecto en español (`verifyLabel`, `readMoreLabel`,
  `internalLabel`, `backLabel`, los `labels` de `ContactForm`…). Para inglés se pasan.
- `PostItem` / `PostsByYear` reciben campos planos (`title`, `href`, `pubDate`, `tags`),
  no un `CollectionEntry`.
- `ProjectList` / `ProjectDetail` reciben strings, no los registros `{es, en}`.
- `Author` trae el avatar embebido como data URI (webp 96×96, ~1.9 KB, en `src/avatar.ts`).
- `EntryGate` suma `position='fixed'|'absolute'`. El original es `fixed` y se saldría de
  la tarjeta; `absolute` es lo que permite verlo dentro del marco de la preview.
- `ContactForm` es presentacional: `status` y `statusMessage` son props, así que los
  estados de éxito/error se pueden ver estáticos. La lógica de envío y el cooldown se
  quedaron en el sitio.
- `SkillsList` suma `renderIcon` para no depender de la red en las previews.

## Known render warns

Warnings que ya se miraron y son legítimos. Si en un re-sync aparece uno que **no** está
acá, es nuevo: miralo.

- `[FONT_MISSING] "Arial Narrow"` — es sólo un *fallback* en la pila de `--font-display`,
  detrás de Rajdhani. Rajdhani e IBM Plex Mono sí embarcan, con sus `@font-face` y 48
  archivos woff2/woff en `fonts/`. No hay nada que arreglar.

## Overrides de presentación

En `cfg.overrides`, puestos porque validate los pidió:

- `SkillsList` y `PostItem`: `cardMode: column` — sus historias son más anchas que una
  celda de grilla y la tarjeta las recortaba.
- `EntryGate`: `cardMode: single` con `viewport: 900x560` — es una portada a pantalla
  completa, no entra en una celda compartida.

## Riesgos para el próximo sync

- **Divergencia `.astro` ↔ `.tsx`.** Es el riesgo principal. Nada lo detecta
  automáticamente: no hay test que compare los dos árboles. Antes de un re-sync, revisá
  `git log src/components/` desde la fecha del último sync.
- **El CSS depende de un build del sitio reciente.** Si `dist/_astro/` quedó viejo, el
  paquete embarca utilidades desactualizadas sin avisar. Corré `pnpm run build` en la
  raíz primero, siempre.
- **El nombre del archivo CSS lleva hash** (`BaseLayout.<hash>.css`). `build.mjs` no lo
  fija: elige el `.css` más grande de `dist/_astro/`. Si algún día el sitio emite otro
  `.css` más grande que el de la hoja principal, va a tomar el equivocado.
- **`IconifyIcon` depende de la API de Iconify.** Sus previews cargaron bien el
  27-sep-2026, pero si un día salen vacías es la red, no el componente.
- **TypeScript 6.** El paquete compila sus tipos con el `tsc` de la raíz, que subió a
  6.0.3 ese mismo día. El `.d.ts` sale de ahí.

## Cómo se corre

```sh
pnpm run build                        # en la raíz — hace falta para el CSS
cd design-system && node build.mjs    # el paquete
cd .. && node .ds-sync/resync.mjs --config .design-sync/config.json \
  --node-modules ./node_modules --entry ./design-system/dist/index.js \
  --out ./ds-bundle --remote .design-sync/.cache/remote-sync.json
```

## Tema oscuro: por qué no hay celdas oscuras

Se intentó agregar una celda `TemaOscuro` y **no se puede** dentro de una tarjeta mixta.

`global.css` declara `--color-magi-*: var(--magi-*)` dentro de `@theme`, que Tailwind
emite sobre `:root`. Las custom properties se resuelven en el elemento donde se
**declaran**, así que `--color-magi-bg` queda computado con el valor claro en `:root` y
ese valor computado hereda hacia abajo. Un `<div class="dark">` redefine `--magi-bg`
pero ya no re-resuelve `--color-magi-bg`: la pieza sigue clara.

Por eso el sitio pone `.dark` en `<html>` — es la única forma de que funcione.

Se probó con un `useLayoutEffect` que agrega la clase a `document.documentElement`: en
la captura por celda (`?story=`) funciona y se ve el oscuro perfecto, pero la tarjeta
completa renderiza todas las celdas en un mismo documento, así que **las cuatro se
tiñeron de oscuro**. Se revirtió.

Si algún día se quiere mostrar el oscuro en el design system, las salidas son:
1. Un componente dedicado cuyas celdas sean **todas** oscuras (con el efecto sobre
   `documentElement`), aislado en su propia tarjeta.
2. Redeclarar los once `--color-magi-*` inline en el envoltorio de la celda. Funciona y
   es scopeado, pero duplica la paleta oscura en las previews y se pudre en silencio si
   se tocan los tokens.

La opción 1 es la sana. Queda como oferta para un re-sync.
