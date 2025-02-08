import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";

const basicPlaygroundDir = dirname(fileURLToPath(import.meta.url));
const sharedDir = resolve(basicPlaygroundDir, "../../shared");

export default defineConfig({
  base: "/build-1/",
  plugins: [symfonyPlugin()],

  build: {
    outDir: "public/build-1",

    rollupOptions: {
      input: {
        pageBuild1: "./assets/page/build-1/index.js",

        app: "./assets/app.js",
        theme: "./assets/theme.scss",
      },
    },

    minify: false,
  },

  server: {
    fs: {
      allow: [".", sharedDir],
    },
  },

  resolve: {
    alias: {
      "~": resolve(basicPlaygroundDir, "assets"),
      "~shared": sharedDir,
    },
  },
});
