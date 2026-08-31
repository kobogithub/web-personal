import { defineConfig } from "astro/config";
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
    extendDefaultPlugins: true,
    rehypePlugins: [
      [
        autoNewTabExternalLinks,
        {
          domain: "localhost:4321",
        },
      ],
    ],
  },
});
