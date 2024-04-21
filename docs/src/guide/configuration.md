# Configuration

## Vite Plugin Symfony <img src="/images/logo-npm.svg" width="39" height="15" style="display: inline; vertical-align: -10%; " />

In order to maintain maximum flexibility, I decided not to create an abstraction layer on top of the `vite.config.js` configuration file.


```js
// vite.config.js
import {defineConfig} from "vite";
import symfonyPlugin from "vite-plugin-symfony";

export default defineConfig({
    plugins: [
        symfonyPlugin(),
    ],

    build: {
        rollupOptions: {
            input: {
                /* relative to the root option */
                app: "./assets/app.ts",

                /* you can also provide [s]css files */
                theme: "./assets/theme.scss"
            },
        }
    },
});
```

The only required option is `build.rollupOptions.input`. With `vite-plugin-symfony` this option must be set as an object.

```ts
export type InputOption = {
  // entryAlias will be used by our Twig functions
  [entryAlias: string]: string;
};
```

If you have a theme containing only css rules (no js) you may define an entry point with a single \[s\]css file. This will in particular [prevent FOUC](/guide/tips#css-files-as-entrypoint) during development.

In order to allow use Vite without configuration, the extension preconfigures some options of Vite if these have not yet been defined. (view [source code](https://github.com/lhapaipai/vite-plugin-symfony/blob/main/src/index.ts)).

This is an interesting extract of the source code of the plugin where you can see how the vite options are preconfigured.

```ts{4-15}
// vite-plugin-symfony/src/index.ts
config(userConfig) {

  const extraConfig: UserConfig = {
    base: userConfig.base ?? "/build/",
    publicDir: false,
    build: {
      manifest: true,
      outDir: userConfig.build?.outDir ?? "public/build",
    },
    optimizeDeps: {
      //Set to true to force dependency pre-bundling.
      force: true,
    },
  };

  return extraConfig;
}
```

For all available options, you can check the [Vite plugin Symfony Reference](/reference/vite-plugin-symfony) page.

## Change the name of the `build` directory.

If you want to specify another directory name to build your assets, you will need to change a few options.

```js
// vite.config.js
export default defineConfig({
  base: '/custom-build/', // [!code ++]
  plugins: [
    symfonyPlugin(),
  ],

  build: {
    outDir: 'public/custom-build', // [!code ++]

    rollupOptions: {
      input: {
        "app": "./assets/app.js",
      },
    },

  },
});
```

You will then need to create a configuration file `pentatrion_vite.yaml` so that `pentatrion/vite-bundle` matches your js configuration.


```yaml{3,4}
#config/packages/pentatrion_vite.yaml
pentatrion_vite:
  build_directory: custom-build // [!code ++]
```

To consult the list of all the available options, you can go to the page [Reference: Vite Bundle](/reference/vite-bundle).
