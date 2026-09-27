---
category: Formularios
---

# ContactForm

Formulario de contacto. La respuesta aparece en un panel de transmisión que entra con `transmit-in` y escribe con `typewriter-cursor`; el color lo fija `status`.

```tsx
<ContactForm onSubmit={send} />
<ContactForm status="error" statusMessage="No se pudo establecer el enlace." />
```
