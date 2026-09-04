import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import { autoNewTabExternalLinks } from "./src/autoNewTabExternalLinks";

// https://astro.build/config
export default defineConfig({
  site: "https://kobouharriet.me",
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [
    mdx(),
    sitemap(),
    partytown(),
    react(), // Agregamos la integración de React
  ],
  // Tailwind 4 se instala como plugin de Vite, no como integración de Astro.
  // `@astrojs/tailwind` quedó descontinuado y no soporta Astro 6+, así que este
  // cambio es además el prerequisito para poder subir de major.
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    // Los plugins van dentro de `unified({...})`, no sueltos en `markdown`.
    // Astro deprecó `markdown.rehypePlugins` a partir de @astrojs/mdx 8, que
    // delega el procesamiento de MDX a los procesadores de Markdown: pasarlos
    // acá afuera avisa en cada build y algún día va a dejar de aplicarlos.
    //
    // También se fue `extendDefaultPlugins: true`, que estaba de adorno: es
    // una opción removida en Astro 2 y no existe en el código de Astro 7.
    processor: unified({
      rehypePlugins: [[autoNewTabExternalLinks, { domain: "localhost:4321" }]],
    }),
  },
});
