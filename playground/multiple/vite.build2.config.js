import { defineConfig } from 'vite'
import { dirname, resolve } from 'path';

import symfonyPlugin from 'vite-plugin-symfony';
import { fileURLToPath } from 'url';

const basicPlaygroundDir = dirname(fileURLToPath(import.meta.url));
const sharedDir = resolve(basicPlaygroundDir, '../../shared')

export default defineConfig({
  base: '/build-2/',
  plugins: [
    symfonyPlugin(),
  ],

  build: {
    outDir: 'public/build-2',
    rollupOptions: {
      input: {
        "pageBuild2": "./assets/page/build-2/index.js",
      },
    },

    minify: false,
  },

  server: {
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
