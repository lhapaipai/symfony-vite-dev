import { defineConfig } from 'vite'
import { resolve } from 'path';

import symfonyPlugin from 'vite-plugin-symfony';
import vuePlugin from "@vitejs/plugin-vue";
import reactPlugin from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    vuePlugin(),
    reactPlugin(),
    symfonyPlugin(),
  ],

  publicDir: false,

  build: {
    manifest: true,
    rollupOptions: {
      input: {
        "pageAssets": "./assets/page/assets/index.js",
        "pageImports": "./assets/page/imports/index.js",
        "pageVue": "./assets/page/vue/main.js",
        "pageReact": "./assets/page/react/main.jsx",
        "pageWelcome": "./assets/page/welcome/index.js",

        "app": "./assets/app.js",
        "theme": "./assets/theme/index.scss"
      }
    },

    minify: false,
  },

  // server: {
  //   origin: 'http://localhost:5173'
  // },

  resolve: {
    alias: {
      '~': resolve(__dirname, 'assets'),
    }
  }
});
