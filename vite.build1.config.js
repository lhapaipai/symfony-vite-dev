import { defineConfig } from 'vite'
import { resolve } from 'path';

import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
  plugins: [
    // Inspect({}),
    symfonyPlugin({
      buildDirectory: 'build1'
    }),
  ],

  publicDir: false,


  build: {
    rollupOptions: {
      input: {
        "pageAssets": "./assets/page/assets/index.js",
        "welcome": "./assets/page/welcome/index.js",
        "theme": "./assets/theme.scss"
      },
    },

    minify: false,
  },

  server: {
    port: 19875
  },

  resolve: {
    alias: {
      '~': resolve(__dirname, 'assets'),
    }
  }
});
