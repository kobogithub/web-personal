#!/usr/bin/env python3
"""Verifica que cada SVG de arquitectura referenciado por el sitio exista.

La ficha o el post referencian `/architecture/{modelo}-{tema}.svg` a mano. Si
alguien renombra una vista, borra un modelo o se equivoca al escribir el
nombre, Astro compila igual y el sitio se publica con una imagen rota: la
referencia es un string, no un import que el build resuelva.

Es la misma clase de falla que un canal de distribución que nadie ejercita —
todo en verde, y el usuario recibe algo que no funciona.

Reporta además los SVG huérfanos: los que se renderizan pero nadie usa. No es
un error (un modelo puede existir antes que el post que lo va a embeber), pero
conviene verlo.

Uso: python3 architecture/check_references.py
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
CONTENT = ROOT / "src"
PUBLIC = ROOT / "public" / "architecture"

REF = re.compile(r"/architecture/([A-Za-z0-9._-]+\.svg)")
SOURCES = ("*.md", "*.mdx", "*.astro", "*.ts", "*.tsx")


def referenced() -> dict[str, list[str]]:
    """Nombre de archivo -> lista de fuentes que lo referencian."""
    hits: dict[str, list[str]] = {}
    for pattern in SOURCES:
        for path in CONTENT.rglob(pattern):
            for name in REF.findall(path.read_text(encoding="utf-8", errors="ignore")):
                hits.setdefault(name, []).append(str(path.relative_to(ROOT)))
    return hits


def main() -> None:
    refs = referenced()
    present = {p.name for p in PUBLIC.glob("*.svg")} if PUBLIC.is_dir() else set()

    missing = {name: srcs for name, srcs in refs.items() if name not in present}
    orphans = sorted(present - set(refs))

    for name in sorted(missing):
        print(f"ROTO  /architecture/{name}", file=sys.stderr)
        for src in sorted(set(missing[name])):
            print(f"      referenciado desde {src}", file=sys.stderr)

    for name in orphans:
        print(f"nota  {name} se renderiza pero nadie lo referencia")

    print(
        f"\n{len(refs)} referencia(s) en el contenido, "
        f"{len(present)} SVG en public/architecture/, "
        f"{len(missing)} rota(s)."
    )

    if missing:
        sys.exit(1)


if __name__ == "__main__":
    main()
