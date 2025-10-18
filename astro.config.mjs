import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import { autoNewTabExternalLinks } from "./src/autoNewTabExternalLinks";

// https://astro.build/config
export default defineConfig({
  site: "https://kobouharriet.site",
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
    tailwind(),
    partytown(),
    react(), // Agregamos la integración de React
  ],
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
