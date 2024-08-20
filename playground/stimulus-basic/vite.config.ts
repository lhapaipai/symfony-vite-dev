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
      stimulus: true,
    }),
    {
      name: "tests",
      // resolveId: {
      //   order: "pre",
      //   handler(id) {
      //     console.log("resolveId", id);
      //   },
      // },
      // async load(id) {
      //   console.log("load", id);

      //   if (isStimulusRequest(id)) {
      //     const importee = id.slice(0, -"?stimulus".length);
      //     const resolution = await this.resolve(importee);
      //     const info = this.getModuleInfo(importee);
      //     const moduleInfos = await this.load(resolution);
      //     const code = moduleInfos.code;
      //     console.log("parsing");
      //   }
      // },
      // transform(code, id, options) {
      //   console.log("transform", id, options);
      // },
      // moduleParsed(a, b, c, d) {
      //   console.log("module parsed");
      // },
    },
    inspect(),
  ],

  optimizeDeps: {
    include: [],
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
