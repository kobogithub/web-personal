# Arquitectura — Modelos C4 (LikeC4)

Los diagramas que se publican en el sitio se modelan con **LikeC4**, no se
dibujan. El modelo es la fuente de verdad; el SVG es un artefacto derivado.

## Estructura

```
architecture/
├── _render.py               # helper compartido: corre `dot` y normaliza la salida
├── render_all.py            # renderiza todos los modelos de una
├── check_drift.py           # ¿algún modelo cambió sin reexportar?
├── check_references.py      # ¿algún SVG referenciado no existe?
└── {proyecto}/
    ├── likec4.config.json
    ├── spec.c4              # vocabulario: element kinds, tags
    ├── model.c4             # elementos y relaciones
    ├── views.c4             # qué vistas se derivan del modelo
    └── render_graphviz.py   # exporta el SVG estático que consume el sitio
```

Agregar un modelo es crear la carpeta con su `render_graphviz.py`. No hay
ninguna lista que actualizar: `render_all.py` los descubre por glob y el
workflow de CI itera sobre las carpetas que tengan `likec4.config.json`.

Los SVG exportados **no** viven acá: van a `public/architecture/`, que es lo
que sirve el sitio.

## Viewer interactivo

```bash
npx likec4 serve architecture/{proyecto}
```

Sirve el modelo con navegación entre vistas. Es la forma de trabajar el modelo;
el export estático es solo para publicar.

## Exportar para el sitio

```bash
python3 architecture/render_all.py              # todos
python3 architecture/{proyecto}/render_graphviz.py   # uno solo
```

Requiere Graphviz (`brew install graphviz`). Render nativo con `dot`, sin
navegador ni headless Chrome.

La salida de `dot` trae un comentario con la versión de Graphviz que la generó.
`_render.py` lo elimina: cambia con cada actualización de Graphviz aunque el
diagrama sea idéntico, y con los SVG versionados eso significa diffs espurios
al exportar desde otra máquina.

Cada diagrama se exporta **dos veces**, una por tema:

```
public/architecture/{proyecto}-light.svg
public/architecture/{proyecto}-dark.svg
```

Un diagrama cuyas etiquetas son prosa —y no solo nombres de herramientas—
agrega una dimensión más, el idioma, y emite cuatro archivos:

```
public/architecture/{proyecto}-{es|en}-{light|dark}.svg
```

Es el caso de `fabric-dos-planos`: el eje del modelo es la velocidad de cambio,
y frases como «cambia rara vez» o «solo ejecutar, no editar» son la mitad del
mensaje. Un diagrama que solo nombra herramientas no necesita esta variante.

El sitio los intercambia con `dark:hidden` / `hidden dark:block`, el mismo
patrón que usan los logos de GitHub en el header. Un SVG con colores fijos se
ve mal en el tema opuesto, y no hay forma limpia de que Graphviz emita
`currentColor`.

La paleta se replica en `THEMES` dentro del script de render, tomada de los
tokens `--magi-*` de `src/styles/global.css`. Si cambian los tokens del sitio,
hay que reexportar.

## Embeber en una ficha de proyecto

Dentro del Markdown de la ficha, en `src/content/projects/{proyecto}/`:

```html
<figure class="my-8">
<div class="overflow-x-auto border border-magi-line bg-magi-surface p-4">
<img src="/architecture/{proyecto}-light.svg" alt="..." class="dark:hidden max-w-none m-0" width="..." height="..." />
<img src="/architecture/{proyecto}-dark.svg"  alt="..." class="hidden dark:block max-w-none m-0" width="..." height="..." />
</div>
<figcaption class="text-xs font-mono text-magi-muted mt-2">...</figcaption>
</figure>
```

El contenedor con `overflow-x-auto` es necesario: los diagramas horizontales
superan el ancho del contenido y deben poder desplazarse en vez de encogerse
hasta volverse ilegibles.

El `alt` describe **el recorrido** que muestra el diagrama, no que es un
diagrama. Es el único contenido que recibe quien no puede verlo.

## Proyectos modelados

| Proyecto | Carpeta | Vistas |
|---|---|---|
| Autogasto | `autogasto/` | contexto · interior del backend |
| Lakehouse Medallion | `lakehouse-medallion/` | contexto · interior del stack local |
| Acelerador de Fabric | `fabric-dos-planos/` | dos planos · estático · dinámico · entornos · medallion |

> `fabric-dos-planos` no es una ficha de proyecto: alimenta el post del blog
> del mismo slug. La convención es la misma.

## Qué chequea CI

El workflow `.github/workflows/architecture.yml` corre en cada push o PR que
toque `architecture/` o `public/architecture/`. Tres chequeos:

| Chequeo | Qué atrapa |
|---|---|
| `likec4 validate` | Un modelo `.c4` roto. |
| `check_drift.py` | Un modelo editado cuyo SVG versionado quedó viejo. |
| `check_references.py` | Un `<img src="/architecture/...">` que apunta a un archivo que no existe. |

El drift se mide comparando **el texto del diagrama, no los bytes**. La
geometría que emite `dot` cambia entre versiones de Graphviz, y la del runner
de GitHub no es la de la máquina donde se exportó: un diff de coordenadas
diría «drift» en cada corrida sin que el modelo haya cambiado. Las etiquetas de
nodos y aristas, en cambio, son estables.

El precio, dicho de frente: un cambio puramente visual —un color, un
`rankdir`— no altera el texto y pasa sin detectarse. Se acepta a cambio de un
chequeo sin falsos positivos, que es la única clase de chequeo que no se
termina ignorando.

Los tres corren en local igual que en CI, sin argumentos.
