#!/usr/bin/env python3
"""Genera el diagrama de arquitectura de Autogasto con Graphviz (SVG).

Fuente de verdad del modelo: los *.c4 de esta carpeta (viewer interactivo con
`npx likec4 serve`). Este script produce la versión estática que se embebe en
el sitio, sin depender de un navegador: render nativo de `dot`.

Emite dos archivos por diagrama, uno por tema. El sitio los intercambia con
`dark:hidden` / `hidden dark:block`, el mismo patrón que ya usan los logos de
GitHub en el header — un SVG con colores fijos se ve mal en el tema opuesto.

Uso: python3 render_graphviz.py
"""

import subprocess
from pathlib import Path

OUT = Path(__file__).parent.parent.parent / "public" / "architecture"

# Paleta MAGI del sitio (ver src/styles/global.css). Se replican acá los
# valores en vez de leer las custom properties porque Graphviz necesita
# colores resueltos, no variables CSS.
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
    },
}


def diagram(c: dict) -> str:
    """Contexto de Autogasto: el recorrido de una foto hasta quedar registrada."""
    return f"""digraph G {{
  rankdir=LR;
  graph [fontname="Helvetica", bgcolor="transparent", compound=true, ranksep=0.9, nodesep=0.35];
  node  [shape=box, style="filled", fontname="Helvetica", fontsize=11,
         color="{c['line']}", fillcolor="{c['surface']}", fontcolor="{c['ink']}", penwidth=1.2, margin="0.18,0.12"];
  edge  [fontname="Helvetica", fontsize=9, color="{c['muted']}", fontcolor="{c['muted']}", penwidth=1.1];

  usuario [label="Usuario", shape=oval, fillcolor="{c['bg']}", color="{c['muted']}"];

  subgraph cluster_tg {{
    label="Telegram"; fontname="Helvetica"; fontsize=11; fontcolor="{c['muted']}";
    style="filled"; fillcolor="{c['cluster_ext']}"; color="{c['line']}"; penwidth=1;
    bot [label="Bot\\n(webhook)", fillcolor="{c['bg']}"];
  }}

  subgraph cluster_api {{
    label="Autogasto API — FastAPI sobre Docker en Railway";
    fontname="Helvetica"; fontsize=12; fontcolor="{c['accent']}";
    style="filled"; fillcolor="{c['cluster_own']}"; color="{c['accent']}"; penwidth=1.6;

    webhook   [label="Router webhook\\nPOST /webhook/telegram"];
    handlers  [label="Telegram handlers\\norquesta el flujo"];
    pdf       [label="Servicio PDF\\nPDF → imagen"];
    storage   [label="Servicio Storage"];
    ocr       [label="Servicio OCR\\nprompt versionado", color="{c['violet']}", penwidth=1.6];
    modelos   [label="Modelos Pydantic\\nvalidan antes de persistir", color="{c['support']}", penwidth=1.6];
    gastos    [label="Servicio Gastos"];
    crud      [label="Router gastos\\nBearer token", style="filled,dashed"];
  }}

  subgraph cluster_ai {{
    label="OpenAI"; fontname="Helvetica"; fontsize=11; fontcolor="{c['muted']}";
    style="filled"; fillcolor="{c['cluster_ext']}"; color="{c['line']}"; penwidth=1;
    gpt [label="GPT-4o Vision", fillcolor="{c['bg']}", color="{c['violet']}"];
  }}

  subgraph cluster_sb {{
    label="Supabase"; fontname="Helvetica"; fontsize=11; fontcolor="{c['muted']}";
    style="filled"; fillcolor="{c['cluster_ext']}"; color="{c['line']}"; penwidth=1;
    bucket [label="Storage\\nimagen original", shape=cylinder, fillcolor="{c['bg']}"];
    db     [label="PostgreSQL\\ngastos · vehiculos", shape=cylinder, fillcolor="{c['bg']}", color="{c['support']}"];
  }}

  usuario  -> bot      [label="  1. foto del ticket  "];
  bot      -> webhook  [label="  2. webhook  "];
  webhook  -> handlers [label="  3. delega  "];
  handlers -> pdf      [label="  si es PDF  ", style=dashed];
  handlers -> storage  [label="  4. guarda original  "];
  storage  -> bucket;
  handlers -> ocr      [label="  5. pide extracción  "];
  ocr      -> gpt      [label="  imagen + prompt + esquema  ", color="{c['violet']}", fontcolor="{c['violet']}"];
  gpt      -> modelos  [label="  6. JSON estructurado  ", color="{c['violet']}", fontcolor="{c['violet']}"];
  modelos  -> gastos   [label="  7. validado  ", color="{c['support']}", fontcolor="{c['support']}"];
  gastos   -> db       [color="{c['support']}"];
  handlers -> bot      [label="  8. resumen  ", style=dashed, constraint=false];
  crud     -> gastos   [style=dashed];
}}
"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for theme, colors in THEMES.items():
        target = OUT / f"autogasto-{theme}.svg"
        subprocess.run(
            ["dot", "-Tsvg", "-o", str(target)],
            input=diagram(colors),
            text=True,
            check=True,
        )
        print(f"  {target.relative_to(OUT.parent.parent)}")


if __name__ == "__main__":
    main()
