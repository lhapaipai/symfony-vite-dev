import { defineConfig } from 'vite'
import { dirname, resolve } from 'path';

import symfonyPlugin from 'vite-plugin-symfony';
import { fileURLToPath } from 'url';

const basicPlaygroundDir = dirname(fileURLToPath(import.meta.url));
const sharedDir = resolve(basicPlaygroundDir, '../../shared')

export default defineConfig({
  plugins: [
    symfonyPlugin({
      buildDirectory: 'build-2'
    }),
  ],

  publicDir: false,


  build: {
    rollupOptions: {
      input: {
        "pageBuild2": "./assets/page/build-2/index.js",
      },
    },

    minify: false,
  },

  server: {
    port: 19876,
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
  }
});
