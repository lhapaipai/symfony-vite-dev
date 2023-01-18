import { defineConfig } from 'vite'
import { resolve } from 'path';

import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
  plugins: [
    // Inspect({}),
    symfonyPlugin({
      buildDirectory: 'build2'
    }),
  ],

  publicDir: false,


  build: {
    rollupOptions: {
      input: {
        "multiple": "./assets/page/multiple/build2.js",
      },
    },

    minify: false,
  },

  server: {
    port: 19876
  },

  resolve: {
    alias: {
      '~': resolve(__dirname, 'assets'),
    }
  }
});
