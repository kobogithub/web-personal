#!/usr/bin/env python3
"""Genera el diagrama del acelerador de Microsoft Fabric con Graphviz (SVG).

Fuente de verdad del modelo: los *.c4 de esta carpeta (viewer interactivo con
`npx likec4 serve`). Este script produce la versión estática que se embebe en
el post, sin depender de un navegador: render nativo de `dot`.

Emite cuatro archivos: dos temas × dos idiomas. El tema lo intercambia el sitio
con `dark:hidden` / `hidden dark:block`, el mismo patrón que ya usan los logos
de GitHub en el header. El idioma existe porque este diagrama lleva etiquetas
en prosa ("cambia rara vez", "solo ejecutar") que son la mitad del mensaje: el
eje del modelo es la velocidad de cambio, no la tecnología, y eso hay que
poder leerlo.

Uso: python3 render_graphviz.py
"""

import subprocess
from pathlib import Path

OUT = Path(__file__).parent.parent.parent / "public" / "architecture"
NAME = "fabric-dos-planos"

# Paleta MAGI del sitio (ver src/styles/global.css). Se replican acá los
# valores en vez de leer las custom properties porque Graphviz necesita
# colores resueltos, no variables CSS.
#
# `dev` y `prd` no salen de los tokens del sitio: son propias del diagrama. La
# distinción entre los dos entornos es lo que hay que poder leer de un vistazo.
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
        "dev": "#5f7a2e",
        "prd": "#8a6d13",
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
        "dev": "#9cb35f",
        "prd": "#d7b64f",
    },
}

# Las etiquetas van afuera del template para que el diagrama pueda emitirse en
# los dos idiomas del post sin duplicar la topología: el modelo es uno solo.
LANGS = {
    "es": {
        "platform": "Plataforma / Infra",
        "dataEng": "Data Engineer",
        "static_title": "PLANO ESTÁTICO  ·  terraform apply  ·  cambia rara vez  ·  dueño: plataforma",
        "dynamic_title": "PLANO DINÁMICO  ·  git push  ·  cambia todos los días  ·  dueño: data engineers",
        "repo_title": "El acelerador — un repositorio, dos mecanismos",
        "tfmod": "Módulos Terraform\\ncapacity · workspace · lakehouse\\nspark pool · shortcut · rbac",
        "wfInfra": "terraform-infra.yml\\nplan en el PR · apply por entorno",
        "scaffold": "create-notebook.sh · Jsonnet\\ngenera solo la primera versión",
        "lab": "Lab local — Docker\\nSpark 3.5 · Delta 3.2 · MinIO\\nespejo de Runtime 1.3, sin capacity",
        "brDev": "branch dev",
        "brProd": "branch prod",
        "deploy": "deploy.py — fabric-cicd\\npublish_all_items\\nunpublish_all_orphan_items",
        "param": "parameter.yml\\nremapea los GUIDs\\nsegún el entorno",
        "azure": "Microsoft Azure — sustrato ARM\\nResource Group + Fabric Capacity (F-SKU)",
        "fabric_title": "Microsoft Fabric — el mismo destino para los dos planos",
        "wsDev": "Workspace dev\\nbronze · silver · gold\\ningenieros: Contributor\\nsolo ejecutar, no editar",
        "wsPrd": "Workspace prd\\nbronze · silver · gold\\ningenieros: Viewer\\nsolo escribe el Service Principal",
        "ext": "Storage externo\\nADLS Gen2 · S3",
        "e_apply": "  terraform apply  ",
        "e_pr": "  abre el PR  ",
        "e_ci": "  apply en CI  ",
        "e_cap": "  crea el RG y provisiona\\nla capacity (ARM)  ",
        "e_backs": "  respalda el cómputo  ",
        "e_creates": "  crea workspace, lakehouses,\\nSpark pool y RBAC  ",
        "e_shortcut": "  shortcut — sin copiar datos  ",
        "e_ask": "  1. pide el scaffold  ",
        "e_scaffold": "  2. .Notebook/ inicial  ",
        "e_write": "  escribe y prueba\\nen feature/*  ",
        "e_prdev": "  3. PR a dev  ",
        "e_promote": "  4. PR de promoción\\nrevisión humana  ",
        "e_push": "  push  ",
        "e_guids": "  GUIDs del entorno  ",
        "e_publish": "  5. publica y borra\\nlo que ya no está en el repo  ",
    },
    "en": {
        "platform": "Platform / Infra",
        "dataEng": "Data Engineer",
        "static_title": "STATIC PLANE  ·  terraform apply  ·  changes rarely  ·  owner: platform",
        "dynamic_title": "DYNAMIC PLANE  ·  git push  ·  changes every day  ·  owner: data engineers",
        "repo_title": "The accelerator — one repository, two mechanisms",
        "tfmod": "Terraform modules\\ncapacity · workspace · lakehouse\\nspark pool · shortcut · rbac",
        "wfInfra": "terraform-infra.yml\\nplan on the PR · apply per environment",
        "scaffold": "create-notebook.sh · Jsonnet\\ngenerates the first version only",
        "lab": "Local lab — Docker\\nSpark 3.5 · Delta 3.2 · MinIO\\nRuntime 1.3 mirror, no capacity",
        "brDev": "branch dev",
        "brProd": "branch prod",
        "deploy": "deploy.py — fabric-cicd\\npublish_all_items\\nunpublish_all_orphan_items",
        "param": "parameter.yml\\nremaps the GUIDs\\nper environment",
        "azure": "Microsoft Azure — ARM substrate\\nResource Group + Fabric Capacity (F-SKU)",
        "fabric_title": "Microsoft Fabric — the same destination for both planes",
        "wsDev": "Workspace dev\\nbronze · silver · gold\\nengineers: Contributor\\nexecute only, no editing",
        "wsPrd": "Workspace prd\\nbronze · silver · gold\\nengineers: Viewer\\nonly the Service Principal writes",
        "ext": "External storage\\nADLS Gen2 · S3",
        "e_apply": "  terraform apply  ",
        "e_pr": "  opens the PR  ",
        "e_ci": "  apply in CI  ",
        "e_cap": "  creates the RG and provisions\\nthe capacity (ARM)  ",
        "e_backs": "  backs the compute  ",
        "e_creates": "  creates workspace, lakehouses,\\nSpark pool and RBAC  ",
        "e_shortcut": "  shortcut — no data copied  ",
        "e_ask": "  1. requests the scaffold  ",
        "e_scaffold": "  2. initial .Notebook/  ",
        "e_write": "  writes and tests\\non feature/*  ",
        "e_prdev": "  3. PR into dev  ",
        "e_promote": "  4. promotion PR\\nhuman review  ",
        "e_push": "  push  ",
        "e_guids": "  environment GUIDs  ",
        "e_publish": "  5. publishes and deletes\\nwhatever left the repo  ",
    },
}


def diagram(c: dict, t: dict) -> str:
    """Los dos planos del acelerador y cómo cada uno llega a los mismos workspaces.

    Orientación TB (no LR): los dos planos son COLUMNAS paralelas que bajan
    hacia el mismo destino. Con rankdir=LR el plano estático tiene 3 escalones
    y el dinámico 6, así que las aristas del corto cruzaban el largo de punta a
    punta y el diagrama salía de 2268pt de ancho, ilegible. En vertical cada
    plano baja por su columna y Fabric queda abajo, alcanzable por los dos con
    aristas cortas.
    """
    return f"""digraph G {{
  rankdir=TB;
  graph [fontname="Helvetica", bgcolor="transparent", compound=true, newrank=true,
         ranksep=0.75, nodesep=0.45];
  node  [shape=box, style="filled", fontname="Helvetica", fontsize=11,
         color="{c['line']}", fillcolor="{c['surface']}", fontcolor="{c['ink']}", penwidth=1.2, margin="0.18,0.12"];
  edge  [fontname="Helvetica", fontsize=9, color="{c['muted']}", fontcolor="{c['muted']}", penwidth=1.1];

  // Plano 1 — lo que cambia rara vez. Estado declarativo en el tfstate.
  subgraph cluster_static {{
    label="{t['static_title']}"; fontname="Helvetica"; fontsize=11; fontcolor="{c['violet']}";
    labelloc="t"; style="filled"; fillcolor="{c['cluster_own']}"; color="{c['violet']}"; penwidth=1.6;

    platform [label="{t['platform']}", shape=oval, fillcolor="{c['bg']}", color="{c['muted']}"];
    tfmod    [label="{t['tfmod']}",    color="{c['violet']}", penwidth=1.8];
    wfInfra  [label="{t['wfInfra']}",  color="{c['line']}", style="filled,dashed"];
    azure    [label="{t['azure']}",    fillcolor="{c['bg']}"];
  }}

  // Plano 2 — lo que cambia todos los días. Sin tfstate: reconciliación.
  subgraph cluster_dynamic {{
    label="{t['dynamic_title']}"; fontname="Helvetica"; fontsize=11; fontcolor="{c['accent']}";
    labelloc="t"; style="filled"; fillcolor="{c['cluster_own']}"; color="{c['accent']}"; penwidth=1.6;

    dataEng  [label="{t['dataEng']}",  shape=oval, fillcolor="{c['bg']}", color="{c['muted']}"];
    scaffold [label="{t['scaffold']}", color="{c['line']}"];
    lab      [label="{t['lab']}",      color="{c['support']}", penwidth=1.8];
    brDev    [label="{t['brDev']}",  shape=cds, fillcolor="{c['bg']}", color="{c['dev']}", fontcolor="{c['dev']}", penwidth=1.8];
    brProd   [label="{t['brProd']}", shape=cds, fillcolor="{c['bg']}", color="{c['prd']}", fontcolor="{c['prd']}", penwidth=1.8];
    param    [label="{t['param']}",    color="{c['line']}", style="filled,dashed"];
    deploy   [label="{t['deploy']}",   color="{c['accent']}", penwidth=1.8];
  }}

  // Destino compartido: los dos planos escriben acá.
  subgraph cluster_fabric {{
    label="{t['fabric_title']}"; fontname="Helvetica"; fontsize=12; fontcolor="{c['muted']}";
    labelloc="b"; style="filled"; fillcolor="{c['cluster_ext']}"; color="{c['line']}"; penwidth=1;
    wsDev [label="{t['wsDev']}", shape=box3d, fillcolor="{c['bg']}", color="{c['dev']}", fontcolor="{c['dev']}", penwidth=1.8];
    wsPrd [label="{t['wsPrd']}", shape=box3d, fillcolor="{c['bg']}", color="{c['prd']}", fontcolor="{c['prd']}", penwidth=1.8];

    // Los dos entornos, lado a lado: son el mismo escalón del despliegue.
    // Sin esto el minlen de las aristas entrantes deja prd arriba de dev y se
    // lee como una secuencia que no existe.
    {{ rank=same; wsDev; wsPrd; }}
  }}

  ext [label="{t['ext']}", shape=cylinder, fillcolor="{c['bg']}", color="{c['muted']}"];

  // Las dos columnas arrancan parejas: sin esto el plano estático empieza a
  // media altura y la comparación entre planos, que es el punto del diagrama,
  // se lee como una jerarquía.
  {{ rank=same; platform; dataEng; }}

  // ── Plano estático: baja por la columna izquierda ───────────────
  platform -> tfmod   [label="{t['e_apply']}", color="{c['violet']}", fontcolor="{c['violet']}"];
  platform -> wfInfra [label="{t['e_pr']}", style=dashed];
  wfInfra  -> tfmod   [label="{t['e_ci']}", style=dashed];
  tfmod    -> azure   [label="{t['e_cap']}"];
  azure    -> wsDev   [label="{t['e_backs']}", style=dashed, lhead=cluster_fabric, minlen=2];
  tfmod    -> wsDev   [label="{t['e_creates']}", color="{c['violet']}", fontcolor="{c['violet']}", minlen=2];
  tfmod    -> wsPrd   [color="{c['violet']}"];

  // ── Plano dinámico: baja por la columna derecha ─────────────────
  dataEng  -> scaffold [label="{t['e_ask']}"];
  scaffold -> lab      [label="{t['e_scaffold']}", style=dashed];
  dataEng  -> lab      [label="{t['e_write']}", color="{c['support']}", fontcolor="{c['support']}"];
  lab    -> brDev  [label="{t['e_prdev']}", color="{c['dev']}", fontcolor="{c['dev']}"];
  brDev  -> brProd [label="{t['e_promote']}", color="{c['prd']}", fontcolor="{c['prd']}"];
  brDev  -> deploy [label="{t['e_push']}"];
  brProd -> deploy [label="{t['e_push']}"];
  param  -> deploy [label="{t['e_guids']}", style=dashed];
  deploy -> wsDev  [label="{t['e_publish']}", color="{c['accent']}", fontcolor="{c['accent']}", minlen=2];
  deploy -> wsPrd  [color="{c['accent']}"];

  // El shortcut entra directo al bronze de dev: no copia datos.
  ext -> wsDev [label="{t['e_shortcut']}", style=dashed];
}}
"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for lang, labels in LANGS.items():
        for theme, colors in THEMES.items():
            target = OUT / f"{NAME}-{lang}-{theme}.svg"
            subprocess.run(
                ["dot", "-Tsvg", "-o", str(target)],
                input=diagram(colors, labels),
                text=True,
                check=True,
            )
            print(f"  {target.relative_to(OUT.parent.parent)}")


if __name__ == "__main__":
    main()
