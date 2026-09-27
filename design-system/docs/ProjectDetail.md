---
category: Catalogo
---

# ProjectDetail

Ficha completa de un proyecto: cabecera enmarcada con chip de estado, rol y período, stack en chips, y debajo el cuerpo en `prose`.

```tsx
<ProjectDetail
  title="Knowledge CLI" summary="CLI en Rust para desarrollo asistido por IA."
  role="Autor" period="2026" status="activo" stack={['Rust', 'MCP']}
>
  <p>El cuerpo de la ficha.</p>
</ProjectDetail>
```
