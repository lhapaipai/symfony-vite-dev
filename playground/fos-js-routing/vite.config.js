import { defineConfig } from 'vite'
import { dirname, resolve } from 'path';

import symfonyPlugin from 'vite-plugin-symfony';
import { fileURLToPath } from 'url';
import inspect from "vite-plugin-inspect";

const basicPlaygroundDir = dirname(fileURLToPath(import.meta.url));
const sharedDir = resolve(basicPlaygroundDir, '../../shared')

export default defineConfig({
  plugins: [
    symfonyPlugin({
      debug: false,
      servePublic: false,
      fosRouting: {}
    }),
    inspect()
  ],

  publicDir: false,

  build: {
    assetsInlineLimit: 512,
    manifest: true,
    rollupOptions: {
      input: {
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
