#!/usr/bin/env python3
"""Genera el diagrama de arquitectura del Lakehouse Medallion con Graphviz (SVG).

Fuente de verdad del modelo: los *.c4 de esta carpeta (viewer interactivo con
`npx likec4 serve`). Este script produce la versión estática que se embebe en
el sitio, sin depender de un navegador: render nativo de `dot`.

Emite dos archivos por diagrama, uno por tema. El sitio los intercambia con
`dark:hidden` / `hidden dark:block`, el mismo patrón que ya usan los logos de
GitHub en el header — un SVG con colores fijos se ve mal en el tema opuesto.

Uso: python3 render_graphviz.py
"""

import sys
from pathlib import Path

# El helper vive en architecture/, un nivel arriba de la carpeta del modelo.
sys.path.insert(0, str(Path(__file__).parent.parent))
from _render import OUT, write_svg  # noqa: E402

# Paleta MAGI del sitio (ver src/styles/global.css). Se replican acá los
# valores en vez de leer las custom properties porque Graphviz necesita
# colores resueltos, no variables CSS.
#
# `bronze`, `silver` y `gold` no salen de los tokens del sitio: son propias del
# diagrama. La distinción entre las tres capas es lo que el medallion tiene que
# comunicar, así que cada una lleva su color en vez de repetir el acento.
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
        "bronze": "#9c5622",
        "silver": "#5c6773",
        "gold": "#8a6d13",
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
        "bronze": "#d38b52",
        "silver": "#a8b4c2",
        "gold": "#d7b64f",
    },
}


def diagram(c: dict) -> str:
    """Contexto del lakehouse: el recorrido del dato de crudo a consumible."""
    return f"""digraph G {{
  rankdir=LR;
  graph [fontname="Helvetica", bgcolor="transparent", compound=true, ranksep=0.9, nodesep=0.4];
  node  [shape=box, style="filled", fontname="Helvetica", fontsize=11,
         color="{c['line']}", fillcolor="{c['surface']}", fontcolor="{c['ink']}", penwidth=1.2, margin="0.18,0.12"];
  edge  [fontname="Helvetica", fontsize=9, color="{c['muted']}", fontcolor="{c['muted']}", penwidth=1.1];

  subgraph cluster_src {{
    label="Origen"; fontname="Helvetica"; fontsize=11; fontcolor="{c['muted']}";
    style="filled"; fillcolor="{c['cluster_ext']}"; color="{c['line']}"; penwidth=1;
    fuentes [label="Fuentes\\narchivos · extractos", fillcolor="{c['bg']}"];
  }}

  subgraph cluster_stack {{
    label="Lakehouse local — Docker Compose, sin cuenta cloud ni cómputo facturado";
    fontname="Helvetica"; fontsize=12; fontcolor="{c['accent']}";
    style="filled"; fillcolor="{c['cluster_own']}"; color="{c['accent']}"; penwidth=1.6;

    airflow [label="Apache Airflow\\norquesta"];

    subgraph cluster_motor {{
      label="Motor de transformación"; fontname="Helvetica"; fontsize=10; fontcolor="{c['muted']}";
      style="filled"; fillcolor="{c['cluster_ext']}"; color="{c['line']}"; penwidth=1;
      dbt    [label="dbt\\ntests + linaje", color="{c['support']}", penwidth=1.6];
      duckdb [label="DuckDB\\nun proceso, sin cluster", color="{c['violet']}", penwidth=1.6];
    }}

    subgraph cluster_minio {{
      label="MinIO — object storage S3-compatible · tablas Apache Iceberg";
      fontname="Helvetica"; fontsize=11; fontcolor="{c['muted']}";
      style="filled"; fillcolor="{c['cluster_ext']}"; color="{c['line']}"; penwidth=1;

      bronze [label="Bronze\\ncrudo, tal como llegó", shape=cylinder,
              fillcolor="{c['bg']}", color="{c['bronze']}", fontcolor="{c['bronze']}", penwidth=1.8];
      silver [label="Silver\\nlimpio · tipado · sin duplicados", shape=cylinder,
              fillcolor="{c['bg']}", color="{c['silver']}", fontcolor="{c['silver']}", penwidth=1.8];
      gold   [label="Gold\\nagregados por caso de uso", shape=cylinder,
              fillcolor="{c['bg']}", color="{c['gold']}", fontcolor="{c['gold']}", penwidth=1.8];
    }}
  }}

  analista [label="Analista", shape=oval, fillcolor="{c['bg']}", color="{c['muted']}"];

  fuentes -> airflow [label="  1. extracción  "];
  airflow -> bronze  [label="  2. escribe el crudo  ", color="{c['bronze']}", fontcolor="{c['bronze']}"];
  bronze  -> silver  [label="  3. limpia, tipa, deduplica  ", color="{c['silver']}", fontcolor="{c['silver']}"];
  silver  -> gold    [label="  4. agrega y modela  ", color="{c['gold']}", fontcolor="{c['gold']}"];
  gold    -> analista [label="  5. consulta  "];

  airflow -> dbt     [label="  dispara  ", style=dashed, constraint=false];
  dbt     -> duckdb  [label="  SQL  ", style=dashed, color="{c['support']}", fontcolor="{c['support']}"];

  // Una sola arista entre clusters (compound=true) en vez de una por capa:
  // dos aristas sueltas cruzaban el diagrama y tachaban el título del cluster.
  duckdb  -> silver  [ltail=cluster_motor, lhead=cluster_minio,
                      label="  lee y escribe\\nIceberg sobre MinIO  ",
                      style=dashed, color="{c['violet']}", fontcolor="{c['violet']}",
                      constraint=false];
}}
"""


def main() -> None:
    for theme, colors in THEMES.items():
        write_svg(OUT / f"lakehouse-medallion-{theme}.svg", diagram(colors))


if __name__ == "__main__":
    main()
