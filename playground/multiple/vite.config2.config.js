import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";

const basicPlaygroundDir = dirname(fileURLToPath(import.meta.url));
const sharedDir = resolve(basicPlaygroundDir, "../../shared");

export default defineConfig({
  base: "/build-2/",
  plugins: [symfonyPlugin()],

  build: {
    assetsInlineLimit: 0,
    outDir: "public/build-2",
    rollupOptions: {
      input: {
        pageBuild2: "./assets/page/build-2/index.js",
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
