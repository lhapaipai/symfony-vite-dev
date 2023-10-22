# Configuration

## Vite Plugin Symfony

In order to maintain maximum flexibility, I decided not to create an abstraction layer on top of the `vite.config.js` configuration file.

The only required option is `build.rollupOptions.input`. With `vite-plugin-symfony` this option must be set as an object.

```ts
export type InputOption = {
  // entryAlias will be used by our Twig functions
  [entryAlias: string]: string;
};
```

if you have a theme containing only css rules (no js) it may be interesting to define an entry point with a \[s\]css file. this will in particular [prevent FOUC](/guide/tips#css-files-as-entrypoint) during development.

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

In order to allow use Vite without configuration, the extension preconfigures some options of Vite if these have not yet been defined. (view [source code](https://github.com/lhapaipai/vite-plugin-symfony/blob/main/src/index.ts))

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

## Vite Bundle

If you change some properties in your `vite.config.js` file, you probably need to create a `pentatrion_vite.yaml` config file for your bundle to sync these modifications. it concerns:

- `vite` options
  - `base`
  - `build.outdir`


```yaml{3,4}
#config/packages/pentatrion_vite.yaml
pentatrion_vite:
  public_directory: public
  build_directory: build

  # etc...
```

For all available options, you can check the [Vite Bundle Reference](/reference/vite-bundle) page.
