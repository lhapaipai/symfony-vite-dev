import { defineConfig } from "vite";
import { dirname, resolve } from "path";
import vue from "@vitejs/plugin-vue";

import symfonyPlugin from "vite-plugin-symfony";
import legacy from "@vitejs/plugin-legacy";
import { fileURLToPath } from "url";

const legacyPlaygroundDir = dirname(fileURLToPath(import.meta.url));
const sharedDir = resolve(legacyPlaygroundDir, "../../shared");

export default defineConfig({
  plugins: [
    symfonyPlugin(),
    vue(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],

  publicDir: false,

  build: {
    manifest: true,
    rollupOptions: {
      input: {
        pageWelcome: "./assets/page/welcome/index.js",
        pageImports: "./assets/page/imports/index.js",

        app: "./assets/app.js",
        theme: "./assets/theme.scss",
      },
    },
  },

  server: {
    fs: {
      allow: [".", sharedDir],
    },
  },

  resolve: {
    alias: {
      "~": resolve(legacyPlaygroundDir, "assets"),
      "~shared": sharedDir,
    },
  },
});
