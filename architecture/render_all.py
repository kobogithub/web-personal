#!/usr/bin/env python3
"""Renderiza todos los modelos de architecture/ a public/architecture/.

Un solo punto de entrada para las tres cosas que necesitan renderizar todo:
el trabajo local, el chequeo de drift en CI y quien llegue nuevo al repo.

Uso: python3 architecture/render_all.py
"""

import runpy
import sys
from pathlib import Path

HERE = Path(__file__).parent


def models() -> list[Path]:
    """Toda subcarpeta con un render_graphviz.py es un modelo. Sin lista que mantener."""
    return sorted(p.parent for p in HERE.glob("*/render_graphviz.py"))


def main() -> None:
    found = models()
    if not found:
        sys.exit("No se encontró ningún modelo con render_graphviz.py en architecture/.")

    for model in found:
        print(f"{model.name}:")
        # runpy en vez de subprocess: un fallo propaga la excepción con su
        # traceback real en vez de un exit code opaco.
        runpy.run_path(str(model / "render_graphviz.py"), run_name="__main__")

    print(f"\n{len(found)} modelo(s) renderizado(s).")


if __name__ == "__main__":
    main()
