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
        transformCheckFileTypes: /\.(js|jsx|ts|tsx|vue)$/,
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
import { defineConfig } from 'vite'
import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
  plugins: [
    symfonyPlugin({
      fosRouting: {
        /**
         * Arguments to pass to the fos:js-routing:dump command
         */
        args? : {
          /**
           * You can check the available options by running `php bin/console fos:js-routing:dump --help`
           * The options below should be pretty self-explanatory.
           */
          target? : string;
          format? : string | "json" | "js";
          locale? : string;
          prettyPrint? : boolean;
          domain? : string[];
          /**
           * Extra arguments to pass to the command, in case the bundle gets updated and the vite plugin does not.
           * This way you won't have to wait for the vite plugin to be updated.
           */
          extraArgs? : object;
        };
        /**
         * File types to check for injecting the route data.
         * By default, we will inject the route data in js, jsx, ts, tsx and vue files.
         */
        transformCheckFileTypes? : RegExp;
        /**
         * A list of files to check for changes. When a file in this array changes, the plugin will dump the routes and
         * eventually if there are new routes we will initiate a full reload in hmr.
         * By default, we will watch for changes in files with the `php` extension in the `src` directory.
         * Combine this option with the `transformCheckFileTypes` option to watch for changes in other file types.
         */
        watchPaths? : string[];
        /**
         * Some Symfony projects use different file extensions for the routes configuration files.
         * This option allows you to specify the possible file extensions.
         * By default, we will look for files with the `php` extension. But you can add more extensions: "yaml", "yml", "xml", "json", etc.
         * Combine this option with the `watchPaths` option to watch for changes in other file types.
         */
        possibleRoutesConfigFilesExt? : string[];
        /**
         * The command to run to dump the routes. Default to php`
         */
        php? : string;
        /**
         * If true, the plugin will output errors and information to the console.
         */
        verbose? : boolean;
      }
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        "app": "./assets/app.js",
      }
    }
  },
});
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
