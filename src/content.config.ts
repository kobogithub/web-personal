import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Astro 5 reemplazó `type: 'content'` por la Content Layer API: la colección
// declara de dónde salen las entradas mediante un loader. `glob` sobre
// `src/content/blog` reproduce el comportamiento anterior.
//
// Consecuencia en el resto del código: las entradas ya no exponen `slug` sino
// `id`, y el render pasó de `entry.render()` al helper `render(entry)`
// importado desde `astro:content`.
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      seoTitle: z.string().optional(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      // Astro 4 validaba acá que la portada midiera al menos 960px de ancho.
      // Ese chequeo ya no es posible: con la Content Layer, `image()` devuelve
      // un marcador (`__ASTRO_IMAGE_<ruta>`) durante la validación del schema y
      // recién se resuelve a un objeto con dimensiones más tarde, así que
      // `img.width` es `undefined` y cualquier `.refine()` sobre el tamaño
      // rechaza todas las imágenes. Las portadas actuales miden 2002px y 1406px,
      // bastante por encima del mínimo que se pedía.
      coverImage: image().optional(),
      lang: z.enum(['es', 'en']).optional().default('es'),
      alternate: z.string().optional(),
    }),
});

// Fichas de proyecto: la narrativa larga (problema, solución, arquitectura,
// decisiones) que no entra en la card de `/projects`.
//
// Un proyecto de `projects.ts` tiene ficha cuando declara `detailSlug`; no
// todos la tienen. Los metadatos de acá alimentan solo la ficha — la card
// sigue leyendo `projects.ts`, que es su fuente.
//
// Cada ficha son dos archivos, `index.md` e `index.en.md`, emparejados con
// `lang` + `alternate` igual que los posts del blog.
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    // Frase corta que encabeza la ficha. Distinta de la descripción de la card:
    // acá hay espacio para decir qué resuelve, no solo qué es.
    summary: z.string(),
    role: z.string(),
    period: z.string(),
    status: z.enum(['activo', 'en-produccion', 'archivado', 'active', 'in-production', 'archived']),
    stack: z.array(z.string()),
    tags: z.array(z.string()).optional(),
    // Solo para proyectos con repositorio público. Los internos lo omiten.
    repoUrl: z.string().url().optional(),
    lang: z.enum(['es', 'en']).optional().default('es'),
    alternate: z.string().optional(),
    // Ordena las fichas entre sí cuando se listan.
    order: z.number().optional().default(99),
  }),
});

export const collections = { blog, projects };
