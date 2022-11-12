import { defineConfig } from 'vite'

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
    outDir: '.local/vite-simple-build'
  },
});
