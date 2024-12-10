import { defineConfig } from "unocss";
import presetIcons from "@unocss/preset-icons";

export default defineConfig({
  presets: [
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  safelist: [
    "i-simple-icons-python",
    "i-simple-icons-amazonaws",
    "i-simple-icons-gnubash",
    "i-simple-icons-docker",
    "i-simple-icons-kubernetes",
    "i-simple-icons-githubactions",
  ],
});
