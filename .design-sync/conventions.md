# Panel MAGI — cómo construir con este sistema

El sistema de diseño de kobouharriet.me. La estética es un panel de instrumental:
esquinas cortadas en vez de bordes redondeados, marcas de retícula que se encienden
en hover, tipografía de display condensada y lecturas técnicas en monoespaciada.

## Puesta en marcha

**No hay provider.** Los componentes se importan y se usan directamente — no hay
`ThemeProvider` ni contexto que envolver. Lo único obligatorio es la hoja de estilos:

```tsx
import { Button, SkillsList } from 'magi-ds';
// styles.css trae los tokens, las fuentes y las utilidades. Sin ella todo
// renderiza con los estilos por defecto del navegador.
```

**Tema oscuro:** se activa con la clase `dark` **en el elemento `<html>`**, y sólo ahí.
Los tokens cambian de valor solos; no hay que tocar ninguna prop ni duplicar clases.

> Que tenga que ir en `<html>` no es un capricho: `--color-magi-*` se declara como
> `var(--magi-*)` sobre `:root`, así que se resuelve **en `:root`**. Un `.dark` en un
> `<div>` más abajo redefine `--magi-*` pero ya no re-resuelve `--color-magi-*`, y la
> pieza sigue renderizando en claro. No existe manera de poner una zona oscura dentro
> de una página clara sin redeclarar los `--color-magi-*` en ese contenedor.

```js
document.documentElement.classList.toggle('dark');
```

**Las fuentes viajan con el bundle:** Rajdhani (display) e IBM Plex Mono (técnica).
No hace falta enlazarlas.

## El idioma: utilidades de Tailwind sobre tokens MAGI

Se maqueta con clases de Tailwind. Los colores **nunca** se escriben literales — se
toman de estas familias, que son las que cambian entre claro y oscuro:

| Familia | Valores | Para qué |
|---|---|---|
| `bg-magi-*` | `bg`, `surface`, `surface2` | Fondo de página, de tarjeta, de campo |
| `text-magi-*` | `ink`, `muted`, `accent`, `accent-ink`, `violet`, `support`, `danger` | Texto principal, secundario, de acento, sobre acento, enlaces, positivo, error |
| `border-magi-*` | `line`, `accent`, `ink`, `support`, `danger` | Líneas y marcos |

El acento (`#d8490f` en claro, `#ff5b21` en oscuro) es naranja quemado y se usa con
moderación: bordes superiores, botones primarios, rótulos. El violeta es el color de
los enlaces; el verde `support` el de las etiquetas técnicas; el rojo `danger` el de
los errores.

**Tipografía:** `font-display` para títulos (Rajdhani — se usa casi siempre con
`uppercase tracking-tight`), `font-mono` para lecturas técnicas, fechas, etiquetas y
botones (IBM Plex Mono, normalmente con `text-xs uppercase tracking-wider`).

## Las doce clases propias

Son las que dan la identidad. Usalas; no reinventes el efecto con utilidades sueltas:

| Clase | Qué hace |
|---|---|
| `corner-cut` | Recorta la esquina inferior izquierda. Va en botones y paneles, **en lugar** de `rounded-*` |
| `corner-mark` | Corchetes de retícula en dos esquinas, que crecen en hover. Va en tarjetas y marcos |
| `glow-accent` | Resplandor de acento en hover, con un empuje de medio píxel |
| `eyebrow` | Rótulo de sección: mono, versalitas, espaciado, en acento |
| `section-title` | Título de sección con su marca delante |
| `hazard-stripe` | Franja diagonal de advertencia |
| `typewriter-cursor` | Cursor que parpadea al final de una línea |
| `transmit-in` | Entrada de un panel de respuesta |
| `magi-bg-fx` | Fondo de grilla animado. Va en superficies grandes |
| `assemble` + `js-assemble` | Entrada animada al aparecer en pantalla. `data-dir="up\|left\|right"` fija de dónde entra |
| `no-scrollbar` | Oculta la barra sin matar el scroll |
| `nav-scroll-fade` | Difumina los bordes de una tira scrolleable |

Todas respetan `prefers-reduced-motion`.

## Dónde está la verdad

- `_ds/<carpeta>/styles.css` y lo que importa — los tokens, las fuentes y las doce clases.
- `components/<grupo>/<Nombre>/<Nombre>.prompt.md` — qué hace cada componente y un ejemplo.
- `components/<grupo>/<Nombre>/<Nombre>.d.ts` — el contrato de props.

Leé el `.d.ts` antes de inventar una prop: varios componentes ya aceptan como prop lo
que parecería necesitar un wrapper (los rótulos de `ProjectDetail`, el `renderIcon` de
`SkillsList`, el `position` de `EntryGate`).

## Un ejemplo idiomático

```tsx
import { SkillsList, Button } from 'magi-ds';

export function Seccion() {
  return (
    <section className="bg-magi-bg py-12">
      <p className="eyebrow mb-2">Stack</p>
      <h2 className="font-display font-bold uppercase tracking-tight text-3xl text-magi-ink mb-6">
        Con qué trabajo
      </h2>

      <SkillsList skills={skills} />

      <div className="corner-mark glow-accent border border-magi-line border-t-2 border-t-magi-accent bg-magi-surface p-5 mt-8">
        <p className="text-magi-muted mb-4">¿Querés el detalle?</p>
        <Button href="/projects/">Ver proyectos</Button>
      </div>
    </section>
  );
}
```

Fijate en el patrón de la tarjeta: `corner-mark` + `glow-accent` + borde de `magi-line`
con `border-t-2 border-t-magi-accent` sobre `bg-magi-surface`. Es el marco que se repite
en todo el sistema — tarjetas de tecnología, de proyecto y cabeceras de ficha.
