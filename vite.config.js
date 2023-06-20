import { defineConfig } from 'vite'
import { resolve } from 'path';

import symfonyPlugin from 'vite-plugin-symfony';
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    // Inspect({}),
    vue(),
    // splitVendorChunkPlugin(),
  ],

  publicDir: false,

  build: {
    manifest: true,
    minify: false,
  },

  resolve: {
    alias: {
      '~': resolve(__dirname, 'assets'),
    }
  }
});
