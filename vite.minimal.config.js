import { defineConfig } from 'vite'
import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
  plugins: [
    symfonyPlugin()
  ],

  build: {
    manifest: true,
    rollupOptions: {
      input: {
        // "welcome": "./assets/welcome.js",
        "theme": "./assets/theme.scss",
      },
    },
  }
});
