import { defineConfig } from 'vite'
import { dirname, resolve } from 'path';

import symfonyPlugin from 'vite-plugin-symfony';
import vuePlugin from "@vitejs/plugin-vue";
import reactPlugin from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

const basicPlaygroundDir = dirname(fileURLToPath(import.meta.url));
const sharedDir = resolve(basicPlaygroundDir, '../../shared')

export default defineConfig(({mode }) => {
  return {
    plugins: [
      vuePlugin(),
      reactPlugin(),
      symfonyPlugin({
        sriAlgorithm: "sha256"
      }),
    ],
  
    base: mode === 'development' ? '/build/' : 'http://cdn.with-cdn.symfony-vite-dev.localhost',
  
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
          "theme": "./assets/theme.scss"
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
  
  
  }
});


