# Arquitectura — Modelos C4 (LikeC4)

Los diagramas que se publican en el sitio se modelan con **LikeC4**, no se
dibujan. El modelo es la fuente de verdad; el SVG es un artefacto derivado.

## Estructura

```
architecture/
└── {proyecto}/
    ├── likec4.config.json
    ├── spec.c4              # vocabulario: element kinds, tags
    ├── model.c4             # elementos y relaciones
    ├── views.c4             # qué vistas se derivan del modelo
    └── render_graphviz.py   # exporta el SVG estático que consume el sitio
```

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
python3 architecture/{proyecto}/render_graphviz.py
```

Requiere Graphviz (`brew install graphviz`). Render nativo con `dot`, sin
navegador ni headless Chrome.

Cada diagrama se exporta **dos veces**, una por tema:

```
public/architecture/{proyecto}-light.svg
public/architecture/{proyecto}-dark.svg
```

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
