import { defineConfig } from 'vite'
import { resolve } from 'path';

import symfonyPlugin from 'vite-plugin-symfony';
import vue from "@vitejs/plugin-vue";
import { splitVendorChunkPlugin } from 'vite'
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    // Inspect({}),
    vue(),
    symfonyPlugin({
      refresh: false
    }),
    splitVendorChunkPlugin(),
  ],

  publicDir: false,


  build: {
    manifest: true,
    rollupOptions: {
      input: {
        "pageAssets": "./assets/page/assets/index.js",
        "pageImports": "./assets/page/imports/index.js",
        "pageVue": "./assets/page/vue/index.js",
        "welcome": "./assets/page/welcome/index.js",
        "theme": "./assets/theme.scss"
      },
      output: {
        // manualChunks: undefined
      },
    },

    minify: false,
  },

  resolve: {
    alias: {
      '~': resolve(__dirname, 'assets'),
    }
  }
});
