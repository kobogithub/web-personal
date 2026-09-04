#!/usr/bin/env python3
"""Detecta modelos editados cuyo SVG versionado quedó sin reexportar.

El modelo `.c4` es la fuente de verdad y el SVG es un artefacto derivado que
igual se versiona, porque el sitio lo sirve estático y el build no tiene
Graphviz. Nada obliga hoy a que uno siga al otro: se puede editar el modelo,
commitear, y publicar un diagrama que muestra la arquitectura anterior. En
verde, sin aviso.

## Por qué compara texto y no bytes

La comparación byte a byte no sirve en CI. La geometría que emite `dot` cambia
entre versiones de Graphviz, y la del runner de GitHub no es la de la máquina
donde se exportó. Un diff de coordenadas diría "drift" en cada corrida sin que
el modelo haya cambiado.

Lo que sí es estable entre versiones es el *contenido*: las etiquetas de nodos
y aristas que Graphviz emite como elementos `<text>`. Si alguien agrega un
componente, renombra una relación o cambia una etiqueta, el texto cambia y esto
lo detecta. Si solo se movieron píxeles, no.

El precio, dicho explícitamente: un cambio puramente visual —un color, un
`rankdir`, un estilo de arista— no altera el texto y pasa sin detectarse. Se
acepta a cambio de un chequeo que no da falsos positivos, que es la única
clase de chequeo que la gente no termina ignorando.

Uso: python3 architecture/check_drift.py
"""

import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).parent.parent
PUBLIC = ROOT / "public" / "architecture"

TEXT = re.compile(r"<text[^>]*>(.*?)</text>", re.DOTALL)


def labels(svg: str) -> list[str]:
    """Texto visible del SVG, en orden de aparición."""
    return [re.sub(r"\s+", " ", t).strip() for t in TEXT.findall(svg)]


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        env = {**os.environ, "ARCH_OUT": tmp}
        result = subprocess.run(
            [sys.executable, str(ROOT / "architecture" / "render_all.py")],
            env=env,
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            print(result.stdout, file=sys.stderr)
            print(result.stderr, file=sys.stderr)
            sys.exit("El render falló. No se puede evaluar el drift.")

        fresh = sorted(Path(tmp).glob("*.svg"))
        if not fresh:
            sys.exit("El render no produjo ningún SVG.")

        drifted: list[str] = []
        absent: list[str] = []

        for f in fresh:
            committed = PUBLIC / f.name
            if not committed.exists():
                absent.append(f.name)
                continue
            if labels(f.read_text()) != labels(committed.read_text()):
                drifted.append(f.name)

    for name in absent:
        print(f"FALTA    {name} — el modelo lo genera pero no está versionado", file=sys.stderr)
    for name in drifted:
        print(f"DRIFT    {name} — el modelo cambió y el SVG versionado no", file=sys.stderr)

    print(f"\n{len(fresh)} SVG renderizado(s), {len(drifted)} con drift, {len(absent)} sin versionar.")

    if drifted or absent:
        print(
            "\nReexportar y commitear:\n"
            "    python3 architecture/render_all.py",
            file=sys.stderr,
        )
        sys.exit(1)


if __name__ == "__main__":
    main()
