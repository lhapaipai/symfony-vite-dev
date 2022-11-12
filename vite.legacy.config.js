import { defineConfig } from 'vite'
import { resolve } from "path";
import { unlinkSync, existsSync } from "fs";
import vue from "@vitejs/plugin-vue";

import symfonyPlugin from 'vite-plugin-symfony';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    symfonyPlugin({
      publicDirectory: 'public',
      buildDirectory: 'build',
      servePublic: false,
      refresh: false,
      // viteDevServerHostname: 'localhost'
    }),
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
  ],

  publicDir: false,


  build: {
    manifest: true,
    rollupOptions: {
      input: {
        "welcome": "./assets/welcome.js",
        "theme": "./assets/theme.scss",
      },
    },
  },
  server: {
    // port: 3000,
    // host: '0.0.0.0',
    // strictPort: true,
    // host: '127.0.0.1',
    // port: 23456, // local port listened by Vite and proxied by NGINX
    // origin: 'https://example.com', // HTTPS & WSS served by NGINX
  },
});
