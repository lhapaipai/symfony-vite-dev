import { defineConfig } from "vite";
import { dirname, resolve } from "path";

import symfonyPlugin from "vite-plugin-symfony";
import inspect from "vite-plugin-inspect";

import { fileURLToPath } from "node:url";

const playgroundDir = dirname(fileURLToPath(import.meta.url));
const sharedDir = resolve(playgroundDir, "../../shared");

export default defineConfig({
  plugins: [
    symfonyPlugin({
      // debug: true,
      stimulus: {
        fetchMode: "lazy",
      },
    }),

    // inspect(),
  ],

  optimizeDeps: {
    include: ["@symfony/ux-toggle-password/dist/controller.js"],
  },

  publicDir: false,

  build: {
    manifest: true,
    rollupOptions: {
      input: {
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
