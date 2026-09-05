#!/usr/bin/env python3
"""Genera el diagrama de la plataforma de datos en GCP con Graphviz (SVG).

Fuente de verdad del modelo: los *.c4 de esta carpeta (viewer interactivo con
`npx likec4 serve`). Este script produce la versión estática que se embebe en
el post, sin depender de un navegador: render nativo de `dot`.

Emite cuatro archivos: dos temas × dos idiomas. El tema lo intercambia el sitio
con `dark:hidden` / `hidden dark:block`. El idioma existe porque acá las
etiquetas son prosa —«ni el owner lo hereda», «el PR no pasa»— y no nombres de
producto: el mensaje del diagrama es qué devuelve cada control, y eso hay que
poder leerlo.

Tres bandas horizontales, y el orden entre ellas es el contenido:

    arriba   dónde se ESCRIBE la regla   (Terraform, el config del modelo, CI)
    medio    quién la APLICA y qué devuelve
    abajo    por dónde pasa el dato

El control queda literalmente entre la regla y el dato, que es donde está: no
protege al dato desde afuera, se interpone.

La frase que cierra la lectura —«las flechas punteadas que bajan son la
distancia entre declarar una regla y aplicarla»— no va adentro del SVG sino en
el `figcaption` del post. Como label del grafo, Graphviz la emite antes que los
recuadros de las bandas y el relleno del cluster la tapa.

Las aristas que bajan de la primera banda a la segunda son el punto del
diagrama: casi ninguna regla se aplica donde se escribió.

Uso: python3 render_graphviz.py
"""

import sys
from pathlib import Path

# El helper vive en architecture/, un nivel arriba de la carpeta del modelo.
sys.path.insert(0, str(Path(__file__).parent.parent))
from _render import OUT, write_svg  # noqa: E402

NAME = "gcp-data-platform"

# Paleta MAGI del sitio (ver src/styles/global.css). Se replican acá los
# valores en vez de leer las custom properties porque Graphviz necesita
# colores resueltos, no variables CSS.
#
# `deny` no sale de los tokens del sitio: es propio del diagrama. Es el color
# de los seis controles, y que sea uno solo y distinto del resto es
# deliberado — se tiene que poder barrer la banda de abajo de un vistazo.
THEMES = {
    "light": {
        "bg": "#f7f5f1",
        "surface": "#ffffff",
        "ink": "#1b1520",
        "muted": "#665d6e",
        "line": "#c9c2cd",
        "accent": "#d8490f",
        "violet": "#5b3383",
        "support": "#5f7a2e",
        "cluster_own": "#f1ede7",
        "cluster_ext": "#eae6e0",
        "deny": "#b02a1e",
        "pending": "#8a8292",
    },
    "dark": {
        "bg": "#1e1826",
        "surface": "#241c30",
        "ink": "#efe8de",
        "muted": "#a79bb0",
        "line": "#4a4155",
        "accent": "#ff5b21",
        "violet": "#9a6fd1",
        "support": "#9cb35f",
        "cluster_own": "#241c30",
        "cluster_ext": "#1a1522",
        "deny": "#f0725f",
        "pending": "#7d7488",
    },
}

# Las etiquetas van afuera del template para que el diagrama pueda emitirse en
# los dos idiomas del post sin duplicar la topología: el modelo es uno solo.
LANGS = {
    "es": {
        "declared_title": "DONDE SE ESCRIBE LA REGLA  ·  Terraform, el config del modelo, el CI",
        "path_title": "EL CAMINO DEL DATO  ·  lo que dibuja todo el mundo",
        "deny_title": "QUIEN DICE QUE NO  ·  y qué devuelve cuando lo dice",
        "iac": "Terraform — 12 módulos\\ncrea los controles y se va",
        "catalog": "Knowledge Catalog\\ntaxonomía · policy tags · glosario",
        "ci": "GitHub Actions\\nfmt · validate · compile · frescura",
        "sources": "Fuentes\\nAPI SaaS paginada · Google Sheets",
        "ingest": "Ingesta — Cloud Functions Gen2\\nuna por fuente, ninguna transforma",
        "bronze": "Bronze — Cloud Storage\\ncrudo, append-only, con linaje",
        "dataform": "Dataform — motor único\\nSQLX versionado, grafo por ref()",
        "silver": "Silver — BigQuery\\ntipado y reglas de negocio",
        "gold": "Gold — BigQuery\\nuna tabla por hecho, grano declarado",
        "access": "Capa de acceso\\nvistas autorizadas + RLS\\n(diseñada, no implementada)",
        "bi": "Tablero de BI",
        "cImmutable": "Bronze es inmutable\\nif_generation_match=0",
        "cDoc": "La doc está al día\\ngenerar_diccionario.py --check",
        "cAssert": "Gold reconcilia con Silver\\nassertion de grano y de total",
        "cTag": "La columna es confidencial\\npolicy tag de la taxonomía",
        "cGrant": "El consumo entra por Gold\\nla SA de BI no tiene Silver",
        "e412": "  412 Precondition Failed  ",
        "eDoc": "  el PR no pasa  ",
        "eAssert": "  Dataform no construye\\nlo que dependía  ",
        "eTag": "  Access Denied on policy tag\\nni el owner lo hereda  ",
        "eGrant": "  sin grant, no hay consulta  ",
        "eInstall": "  instala  ",
        "eApply": "  lo aplica por nivel,\\nnunca por id  ",
        "eId": "  el id, que no existe\\nhasta después del apply  ",
        "eDeclare": "  declara  ",
        "ePut": "  sube con la\\nprecondición puesta  ",
    },
    "en": {
        "declared_title": "WHERE THE RULE IS WRITTEN  ·  Terraform, the model config, CI",
        "path_title": "THE PATH OF THE DATA  ·  what everyone draws",
        "deny_title": "WHO SAYS NO  ·  and what it returns when it does",
        "iac": "Terraform — 12 modules\\ninstalls the controls and leaves",
        "catalog": "Knowledge Catalog\\ntaxonomy · policy tags · glossary",
        "ci": "GitHub Actions\\nfmt · validate · compile · freshness",
        "sources": "Sources\\npaginated SaaS API · Google Sheets",
        "ingest": "Ingestion — Cloud Functions Gen2\\none per source, none transforms",
        "bronze": "Bronze — Cloud Storage\\nraw, append-only, with lineage",
        "dataform": "Dataform — single engine\\nversioned SQLX, graph from ref()",
        "silver": "Silver — BigQuery\\ntyping and business rules",
        "gold": "Gold — BigQuery\\none table per fact, declared grain",
        "access": "Access layer\\nauthorized views + RLS\\n(designed, not implemented)",
        "bi": "BI dashboard",
        "cImmutable": "Bronze is immutable\\nif_generation_match=0",
        "cDoc": "The docs are current\\ngenerar_diccionario.py --check",
        "cAssert": "Gold reconciles with Silver\\ngrain and total assertions",
        "cTag": "The column is confidential\\npolicy tag from the taxonomy",
        "cGrant": "Consumption enters via Gold\\nthe BI SA has no Silver grant",
        "e412": "  412 Precondition Failed  ",
        "eDoc": "  the PR doesn't pass  ",
        "eAssert": "  Dataform won't build\\nwhat depended on it  ",
        "eTag": "  Access Denied on policy tag\\nnot even the owner inherits it  ",
        "eGrant": "  no grant, no query  ",
        "eInstall": "  installs  ",
        "eApply": "  applies it by level,\\nnever by id  ",
        "eId": "  the id, which doesn't exist\\nuntil after the apply  ",
        "eDeclare": "  declares  ",
        "ePut": "  uploads with the\\nprecondition set  ",
    },
}


def diagram(c: dict, t: dict) -> str:
    """El camino del dato con los controles colgando de cada tramo.

    Orientación LR (no TB): el camino del dato es una secuencia de ocho pasos y
    en vertical sale más alto que ancho, lo que en una columna de blog se
    encoge hasta ser ilegible. En horizontal cada paso es una columna y los
    controles caen debajo del tramo que protegen.

    Solo las aristas del camino llevan `constraint=true`. Todo lo demás
    —instalación de controles y rechazos— va con `constraint=false`: si
    participaran del ranking, cada control se llevaría su propia columna y las
    tres bandas se mezclarían.

    Dos ausencias deliberadas respecto del modelo `.c4`:

    - El **actor** que escribe la regla. Sus tres aristas cruzaban el diagrama
      entero para decir algo que no es la tesis: quién teclea importa menos que
      dónde termina ejecutándose lo que tecleó.
    - El control del **límite de 30 caracteres** del account_id. Es el único de
      los seis que no protege un tramo del camino —frena un `plan`, no un
      dato— y meterlo acá obligaba a una arista que volvía sobre sí misma de
      punta a punta. Vive en la vista `controles` del modelo.

    Las dos son razones de legibilidad, no de contenido: el modelo sigue
    teniéndolas y el post las cuenta.
    """
    return f"""digraph G {{
  rankdir=LR;
  graph [fontname="Helvetica", bgcolor="transparent", compound=true, newrank=true,
         ranksep=0.55, nodesep=0.34];
  node  [shape=box, style="filled", fontname="Helvetica", fontsize=11,
         color="{c['line']}", fillcolor="{c['surface']}", fontcolor="{c['ink']}", penwidth=1.2, margin="0.18,0.12"];
  edge  [fontname="Helvetica", fontsize=9, color="{c['muted']}", fontcolor="{c['muted']}", penwidth=1.1];

  // ── Banda 1: donde se escribe la regla ──────────────────────────
  subgraph cluster_declared {{
    label="{t['declared_title']}"; fontname="Helvetica"; fontsize=11; fontcolor="{c['violet']}";
    labelloc="t"; labeljust="l"; style="filled"; fillcolor="{c['cluster_own']}"; color="{c['violet']}"; penwidth=1.6;

    ci      [label="{t['ci']}",      color="{c['line']}", style="filled,dashed"];
    iac     [label="{t['iac']}",     color="{c['violet']}", penwidth=1.8];
    catalog [label="{t['catalog']}", color="{c['violet']}", penwidth=1.8];
  }}

  // ── Banda 2: el camino del dato ─────────────────────────────────
  subgraph cluster_path {{
    label="{t['path_title']}"; fontname="Helvetica"; fontsize=11; fontcolor="{c['muted']}";
    labelloc="b"; labeljust="l"; style="filled"; fillcolor="{c['cluster_ext']}"; color="{c['line']}"; penwidth=1;

    sources  [label="{t['sources']}",  shape=cylinder, fillcolor="{c['bg']}", color="{c['muted']}"];
    ingest   [label="{t['ingest']}",   color="{c['support']}", penwidth=1.6];
    bronze   [label="{t['bronze']}",   shape=box3d, fillcolor="{c['bg']}", color="{c['muted']}"];
    dataform [label="{t['dataform']}", color="{c['support']}", penwidth=1.8];
    silver   [label="{t['silver']}",   shape=box3d, fillcolor="{c['bg']}", color="{c['muted']}"];
    gold     [label="{t['gold']}",     shape=box3d, fillcolor="{c['bg']}", color="{c['muted']}"];
    access   [label="{t['access']}",   color="{c['pending']}", fontcolor="{c['pending']}", style="filled,dashed"];
    bi       [label="{t['bi']}",       shape=oval, fillcolor="{c['bg']}", color="{c['muted']}"];
  }}

  // ── Banda 3: quién dice que no ──────────────────────────────────
  subgraph cluster_deny {{
    label="{t['deny_title']}"; fontname="Helvetica"; fontsize=11; fontcolor="{c['deny']}";
    labelloc="t"; labeljust="l"; style="filled"; fillcolor="{c['cluster_own']}"; color="{c['deny']}"; penwidth=1.6;

    cImmutable [label="{t['cImmutable']}", color="{c['deny']}", fontcolor="{c['deny']}", penwidth=1.8];
    cDoc       [label="{t['cDoc']}",       color="{c['deny']}", fontcolor="{c['deny']}", penwidth=1.8];
    cAssert    [label="{t['cAssert']}",    color="{c['deny']}", fontcolor="{c['deny']}", penwidth=1.8];
    cTag       [label="{t['cTag']}",       color="{c['deny']}", fontcolor="{c['deny']}", penwidth=1.8];
    cGrant     [label="{t['cGrant']}",     color="{c['deny']}", fontcolor="{c['deny']}", penwidth=1.8];
  }}

  // ── El camino: lo único que define las columnas ─────────────────
  sources  -> ingest;
  ingest   -> bronze;
  bronze   -> dataform;
  dataform -> silver;
  silver   -> gold;
  gold     -> access;
  access   -> bi;

  // Cada control comparte columna con el tramo que protege: es lo que hace
  // que caiga justo debajo y no haya que seguir la flecha para saber de qué
  // habla. Y cada pieza de la banda de arriba comparte columna con el control
  // que instala, para que la arista que las une sea corta y se lea como lo
  // que es: una bajada, no un cruce.
  {{ rank=same; ingest;               ci;      }}
  {{ rank=same; bronze;   cImmutable;          }}
  {{ rank=same; dataform; cDoc;                }}
  {{ rank=same; silver;   cAssert;    iac;     }}
  {{ rank=same; gold;     cTag;       catalog; }}
  {{ rank=same; access;   cGrant;              }}

  // ── De arriba abajo: la regla se instala donde no se escribió ───
  iac      -> catalog    [constraint=false, color="{c['violet']}"];
  iac      -> cGrant     [label="{t['eInstall']}", constraint=false, style=dashed, color="{c['violet']}", fontcolor="{c['violet']}"];
  catalog  -> cTag       [label="{t['eId']}",      constraint=false, style=dashed, color="{c['violet']}", fontcolor="{c['violet']}"];
  ci       -> cDoc       [label="{t['eInstall']}", constraint=false, style=dashed];
  dataform -> cTag       [label="{t['eApply']}",   constraint=false, style=dashed, color="{c['support']}", fontcolor="{c['support']}"];
  dataform -> cAssert    [label="{t['eDeclare']}", constraint=false, style=dashed, color="{c['support']}", fontcolor="{c['support']}"];
  ingest   -> cImmutable [label="{t['ePut']}",     constraint=false, style=dashed, color="{c['support']}", fontcolor="{c['support']}"];

  // ── El rechazo: lo que devuelve cada control ────────────────────
  cImmutable -> bronze   [label="{t['e412']}",    constraint=false, color="{c['deny']}", fontcolor="{c['deny']}", penwidth=1.5];
  cDoc       -> dataform [label="{t['eDoc']}",    constraint=false, color="{c['deny']}", fontcolor="{c['deny']}", penwidth=1.5];
  cAssert    -> gold     [label="{t['eAssert']}", constraint=false, color="{c['deny']}", fontcolor="{c['deny']}", penwidth=1.5];
  cTag       -> silver   [constraint=false, color="{c['deny']}", penwidth=1.5];
  cTag       -> gold     [label="{t['eTag']}",    constraint=false, color="{c['deny']}", fontcolor="{c['deny']}", penwidth=1.5];
  cGrant     -> access   [label="{t['eGrant']}",  constraint=false, color="{c['deny']}", fontcolor="{c['deny']}", penwidth=1.5];
}}
"""


def main() -> None:
    for lang, labels in LANGS.items():
        for theme, colors in THEMES.items():
            write_svg(OUT / f"{NAME}-{lang}-{theme}.svg", diagram(colors, labels))


if __name__ == "__main__":
    main()
