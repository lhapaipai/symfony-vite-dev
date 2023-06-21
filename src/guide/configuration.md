# Configuration

## Vite Plugin Symfony

For the transparency, I decided not to create an overlay of the config file `vite.config.js`. You can check the full documentation of the `vite-plugin-symfony` in the github repository [github.com/lhapaipai/vite-plugin-symfony](https://github.com/lhapaipai/vite-plugin-symfony).

```js
// vite.config.js
import {defineConfig} from "vite";
import symfonyPlugin from "vite-plugin-symfony";

/* if you're using React */
// import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        /* react(), // if you're using React */
        symfonyPlugin(),
    ],

    build: {
        rollupOptions: {
            input: {
                /* relative to the root option */
                app: "./assets/app.ts",

                /* you can also provide css files to prevent FOUC */
                theme: "./assets/theme.css"
            },
        }
    },
});
```

## Vite Bundle

If you change some properties in your `vite.config.js` file, you probably need to create a `config/packages/pentatrion_vite.yaml` file to postpone these changes. it concerns `server.host`, `server.port`, `server.https` and `build.outdir` (and also `base`).
