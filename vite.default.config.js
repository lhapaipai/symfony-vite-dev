import { defineConfig } from 'vite'

import symfonyPlugin from 'vite-plugin-symfony';
import vue from "@vitejs/plugin-vue";
import { splitVendorChunkPlugin } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    symfonyPlugin(),
    splitVendorChunkPlugin()
  ],

  publicDir: false,


  build: {
    // manifest: true,
    rollupOptions: {
      input: {
        "pageAssets": "./assets/page-assets.js",
        "pageImports": "./assets/page-imports.js",
        "pageVue": "./assets/page-vue.js",
        "welcome": "./assets/welcome.js",
        "theme": "./assets/theme.scss",
      },
      output: {
        // manualChunks: undefined
      }
    },

    // sourcemap: true,
    minify: false
  },
});
