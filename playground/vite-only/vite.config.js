import { defineConfig } from 'vite'
import { resolve } from 'path';

// import legacy from '@vitejs/plugin-legacy';

import vue from "@vitejs/plugin-vue";
// import Inspect from 'vite-plugin-inspect'
import sri from '@small-tech/vite-plugin-sri';

export default defineConfig({
  plugins: [
    sri(),
    // Inspect({}),
    vue(),
    // legacy({
    //   targets: ['defaults', 'not IE 11']
    // }),
  ],

  publicDir: false,

  build: {
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
        },
      },
    },

    minify: false,
  },

  server: {
    // port: 3000,
    // host: '0.0.0.0',
    // strictPort: true,
    // host: '127.0.0.1',
    // port: 23456, // local port listened by Vite and proxied by NGINX
    // origin: 'https://example.com', // HTTPS & WSS served by NGINX
  },

  resolve: {
    alias: {
      '~': resolve(__dirname, 'assets'),
    }
  }
});
