## Migration

For vite v2.8/v2.9 use vite-plugin-symfony v0.3.x

## Vitejs previous versions

Vite base config with vite 2.8/2.9

```js
// vite.config.js
import {defineConfig} from "vite";
import symfonyPlugin from "vite-plugin-symfony";
/* if you're using React */
// import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
    plugins: [
        /* reactRefresh(), // if you're using React */
        symfonyPlugin(),
    ],

    root: ".",

    /* your outDir web path prefix */
    base: "/build/",

    /* By default, Vite will copy all assets in /public to the build directory. */
    /* no longer needed because your web server already does it */
    publicDir: false,

    build: {
        manifest: true,
        emptyOutDir: true,
        assetsDir: "",
        outDir: "./public/build",
        rollupOptions: {
            input: {
              app: "./assets/app.js" /* relative to the root option */
            },
        },
    }
});
```

and your package.json :
```json
{
    "scripts": {
        "dev": "vite",
        "build": "vite build"
    },
    "devDependencies": {
        "vite": "~2.9",
        "vite-plugin-symfony": "^0.3.0"
    }
}
```



There is small differences in the configuration of the input paths with vitejs 2.6 and vitejs 2.7.

```js
// vite 2.7
// vite.config.js
import {defineConfig} from "vite";
import symfonyPlugin from "vite-plugin-symfony";
/* if you're using React */
// import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
    plugins: [
        /* reactRefresh(), // if you're using React */
        symfonyPlugin(),
    ],

    root: "./assets/",

    /* your outDir web path prefix */
    base: "/build/",
    build: {
        manifest: true,
        emptyOutDir: true,
        assetsDir: "",
        outDir: "../public/build/",
        rollupOptions: {
            input: {
              app: "./app.ts" /* relative to the root option */
            },
        },
    }
});
```



```js
// Vite 2.6
// vite.config.js
import {defineConfig} from "vite";
import symfonyPlugin from "vite-plugin-symfony";
/* if you're using React */
// import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
    plugins: [
        /* reactRefresh(), // if you're using React */
        symfonyPlugin(),
    ],

    root: "./assets/",

    /* your outDir web path prefix */
    base: "/build/",
    build: {
        manifest: true,
        emptyOutDir: true,
        assetsDir: "",
        outDir: "../public/build/",
        rollupOptions: {
            input: {
              app: "./assets/app.ts" /* relative to the root option */
            },
        },
    }
});
```
