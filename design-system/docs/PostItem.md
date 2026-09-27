---
category: Contenido
---

# PostItem

Una fila del índice del blog: fecha, título y chips de etiquetas. Entra animada con `assemble`.

```tsx
<PostItem
  title="Ni el owner puede leer esa columna"
  href="/ni-el-owner-puede-leer/"
  pubDate={new Date('2026-09-05')}
  tags={['snowflake', 'gobierno']}
  tagHref={(t) => `/tags/${t}/`}
/>
```
