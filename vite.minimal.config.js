import { defineConfig } from 'vite'
import { resolve } from 'path';
import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
  plugins: [
    symfonyPlugin()
  ],

  build: {
    manifest: true,
    rollupOptions: {
      input: {
        // "welcome": "./assets/page/welcome/index.js",
        "theme": "./assets/theme.scss",
      },
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, 'assets'),
    }
  }
});
