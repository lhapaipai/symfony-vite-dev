import { defineConfig } from 'vite'
import { dirname, resolve } from 'path';

import symfonyPlugin from 'vite-plugin-symfony';
import vuePlugin from "@vitejs/plugin-vue";
import reactPlugin from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const basicPlaygroundDir = dirname(fileURLToPath(import.meta.url));
const sharedDir = resolve(basicPlaygroundDir, '../../shared')

export default defineConfig({
  plugins: [
    vuePlugin(),
    reactPlugin(),
    symfonyPlugin({
      debug: false,
      servePublic: false
    }),
  ],

  publicDir: false,

  build: {
    assetsInlineLimit: 2048,
    manifest: true,
    rollupOptions: {
      input: {
        "pageAssets": "./assets/page/assets/index.js",
        "pageImports": "./assets/page/imports/index.js",
        "pageVue": "./assets/page/vue/main.js",
        "pageReact": "./assets/page/react/main.jsx",
        "pageWelcome": "./assets/page/welcome/index.js",

        "app": "./assets/app.js",
        "theme": "./assets/theme.scss"
      },
      output: {
        manualChunks: {
          vue: ['vue']
        }
      }
    },
    
    minify: false,
  },


  server: {
    // port: 5175,
    // origin: 'http://localhost:5175',
    // strictPort: true,
    fs: {
      allow: [
        '.',
        sharedDir
      ]
    },
    watch: {
      ignored: ['**/.idea/**', '**/tests/**', '**/var/**', '**/vendor/**'],
    }
  },

  resolve: {
    alias: {
      '~': resolve(basicPlaygroundDir, 'assets'),
      '~shared': sharedDir
    }
  },


});
