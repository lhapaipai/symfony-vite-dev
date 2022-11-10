import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";

import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
  plugins: [
    symfonyPlugin(),
    vue(),
  ],

  publicDir: false,


  build: {
    manifest: true,
    rollupOptions: {
      input: {
        "pageAssets": "./assets/page-assets.js",
        "pageImports": "./assets/page-imports.js",
        "welcome": "./assets/welcome.js",
        "theme": "./assets/theme.scss",
      },
    },
  },
});
