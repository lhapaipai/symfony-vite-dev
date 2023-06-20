import { defineConfig } from 'vite'
import { resolve } from 'path';

import symfonyPlugin from 'vite-plugin-symfony';
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from 'url';

const projectDir = resolve(fileURLToPath(new URL('.', import.meta.url)));

export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false
        }
      }
    }),
    symfonyPlugin({
      refresh: false,
      debug: true,
    }),
  ],

  publicDir: false,

  base: "/build/client/",
  
  build: {
    outDir: "public/build/client",
    rollupOptions: {
      input: {
        // "pageAssets": "./assets/page/assets/index.js",
        // "pageImports": "./assets/page/imports/index.js",
        "pageVue": "./assets/page/vue/index.js",
        // "welcome": "./assets/page/welcome/index.js",
        // "theme": "./assets/theme.scss"
      }
    },

    minify: false,
  },

  resolve: {
    alias: {
      '~': resolve(projectDir, 'assets'),
    }
  }
});
