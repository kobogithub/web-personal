---
category: Acciones
---

# Button

Botón del panel MAGI: esquina cortada, tipografía mono en versalitas y un empuje de medio píxel en hover. Renderiza `<a>` por defecto; `as="button"` para acciones que no navegan.

```tsx
<Button href="/projects/">Ver proyectos</Button>
<Button variant="secondary" as="button" onClick={save}>Guardar</Button>
<Button variant="ghost" href="/rss.xml">RSS</Button>
```
