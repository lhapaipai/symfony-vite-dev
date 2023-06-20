import { defineConfig } from 'vite'
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

import symfonyPlugin from 'vite-plugin-symfony';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    symfonyPlugin(),
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
  ],

  publicDir: false,


  build: {
    manifest: true,
    rollupOptions: {
      input: {
        // "pageAssets": "./assets/page/assets/index.js",
        // "pageImports": "./assets/page/imports/index.js",
        // "pageVue": "./assets/page/vue/index.js",
        "welcome": "./assets/page/welcome/index.js",
        // "theme": "./assets/theme.scss",
      },
    },
  },

  resolve: {
    alias: {
      '~': resolve(__dirname, 'assets'),
    }
  }
});
