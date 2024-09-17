import { defineConfig, Plugin } from "vite";
import { dirname, resolve } from "path";

import symfonyPlugin from "vite-plugin-symfony";
import vuePlugin from "@vitejs/plugin-vue";
import reactPlugin from "@vitejs/plugin-react";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import inspect from "vite-plugin-inspect";

import { fileURLToPath } from "url";

const playgroundDir = dirname(fileURLToPath(import.meta.url));
const sharedDir = resolve(playgroundDir, "../../shared");

export default defineConfig({
  plugins: [
    vuePlugin(),
    reactPlugin(),
    svelte(),
    symfonyPlugin({
      // debug: true,
      stimulus: true,
    }),

    inspect(),
  ],

  optimizeDeps: {
    include: [
      "swup",
      "@swup/debug-plugin",
      "@swup/forms-plugin",
      "@swup/fade-theme",
      "@swup/slide-theme",
      "chart.js/auto",
      "cropperjs",
      "tom-select",
      "typed.js",
    ],
  },

  publicDir: false,

  build: {
    manifest: true,
    rollupOptions: {
      input: {
        pageTranslator: "./assets/page/translator/index.ts",
        app: "./assets/app.ts",
        theme: "./assets/theme.scss",
      },
    },

    minify: false,
  },

  server: {
    // origin: 'http://localhost:5173',
    fs: {
      allow: [".", sharedDir],
    },
  },

  resolve: {
    alias: {
      "~": resolve(playgroundDir, "assets"),
      "~project": playgroundDir,
      "~shared": sharedDir,
    },
  },
});
