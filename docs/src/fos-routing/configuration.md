# Configuration

## Defaults

Below we have all the options available for the `fosRouting` option with their defaults.

```js
// vite.config.js
import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";

export default defineConfig({
  plugins: [
    symfonyPlugin({
      fosRouting: {
        args: {
          target: "var/cache/fosRoutes.json",
          format: "json",
          locale: "",
          prettyPrint: false,
          domain: [],
          extraArgs: {},
        },
        addImportByDefault: true,
        routingPluginPackageName: "fos-router",
        watchPaths: ["src/**/*.php"],
        possibleRoutesConfigFilesExt: ["php"],
        verbose: false,
        php: "php",
      },
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        "app": "./assets/app.js",
      },
    },
  },
});
```

## All options with types and explanations

```js
// vite.config.js
import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";

export default defineConfig({
  plugins: [
    symfonyPlugin({
      fosRouting: {
        /**
         * Arguments to pass to the fos:js-routing:dump command
         */
        args?: {
          /**
           * You can check the available options by running
           * `php bin/console fos:js-routing:dump --help`
           * The options below should be pretty self-explanatory.
           *
           * @default "var/cache/fosRoutes.json"
           */
          target?: string;
          /**
           * @default ""
           */
          locale?: string;
          /**
           * @default false
           */
          prettyPrint?: boolean;
          /**
           * @default []
           */
          domain?: string[];
          /**
           * Extra arguments to pass to the command, in case the bundle gets
           * updated and the vite plugin does not.
           * This way you won't have to wait for the vite plugin to be updated.
           * @default {}
           */
          extraArgs?: object;
        };
      /**
       * If true, the plugin will add the import statement to the entry file automatically.
       * So you don't have to do it manually.
       * @default true
       */
      addImportByDefault?: boolean;
      /**
       * The package name of the routing plugin.
       * @default "fos-router"
       */
      routingPluginPackageName?: string;
      /**
       * A list of files to check for changes. When a file in this array changes,
       * the plugin will dump the routes and eventually if there are new routes we
       * will initiate a full reload in hmr. By default, we will watch for changes
       * in files with the `php` extension in the `src` directory. Combine this
       * option with the `transformCheckFileTypes` option to watch for changes in
       * other file types.
       *
       * @default ["src//**//*.php"]"
       */
      watchPaths?: string[];
      /**
       * Some Symfony projects use different file extensions for the routes
       * configuration files.
       * This option allows you to specify the possible file extensions.
       * By default, we will look for files with the `php` extension.
       * But you can add more extensions: "yaml", "yml", "xml", "json", etc.
       * Combine this option with the `watchPaths` option to watch for changes
       * in other file types.
       *
       * @default ["php"]
       */
      possibleRoutesConfigFilesExt?: string[];
      /**
       * The command to run to dump the routes.
       *
       * @default "php"
       */
      php?: string;
      /**
       * If true, the plugin will output errors and information to the console.
       *
       * @default false
       */
      verbose?: boolean;
    },
  }),
  ],
  build: {
    rollupOptions: {
      input: {
        "app": "./assets/app.js",
      },
    },
  },
});
;
```

## Examples

The development repository [lhapaipai/symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) contains
a `playground/fos-js-routing` directory containing a complete implementation of Fos Routing Bundle with Vite.

```bash
git clone https://github.com/lhapaipai/symfony-vite-dev.git
cd symfony-vite-dev
make install
cd playground/fos-js-routing
composer install
npm i

symfony serve
npm run dev
```
