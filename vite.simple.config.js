import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";

import symfonyPlugin from 'vite-plugin-symfony';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    // symfonyPlugin(),
    // legacy({
    //   targets: ['defaults', 'not IE 11']
    // }),
  ],

  publicDir: false,

  build: {
    manifest: true,
  },
});
