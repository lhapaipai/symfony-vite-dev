import { defineConfig } from 'vite'
import { dirname, resolve } from 'path';

import symfonyPlugin from 'vite-plugin-symfony';
import { fileURLToPath } from 'url';

const basicPlaygroundDir = dirname(fileURLToPath(import.meta.url));
const sharedDir = resolve(basicPlaygroundDir, '../../shared')

export default defineConfig({
  plugins: [
    symfonyPlugin({
      buildDirectory: 'build-1'
    }),
  ],

  publicDir: false,


  build: {
    rollupOptions: {
      input: {
        "pageBuild1": "./assets/page/build-1/index.js",

        "app": "./assets/app.js",
        "theme": "./assets/theme.scss"
      },
    },

    minify: false,
  },

  server: {
    port: 19875,
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
