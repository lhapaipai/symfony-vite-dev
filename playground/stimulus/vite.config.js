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
      // debug: true,
    }),
  ],

  publicDir: false,

  build: {
    manifest: true,
    rollupOptions: {
      input: {
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
    // origin: 'http://localhost:5173',
    fs: {
      allow: [
        '.',
        sharedDir
      ]
    }
  },

  resolve: {
    alias: {
      '~': resolve(basicPlaygroundDir, 'assets'),
      '~shared': sharedDir
    }
  },


});
