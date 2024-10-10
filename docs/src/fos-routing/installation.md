# Fos Routing

FosRoutingBundle allows you to expose your routing in your JavaScript code. That means you'll be able to generate URL
with given parameters like you can do with the Router component provided in the Symfony2 core. The bundle only supports
Webpack Encore out of the box, but you can use it with Vite by following the instructions below.

::: warning
🧪 If you are running your frontend on an enclosed dev environment (ex. your app has two separate docker containers for
frontend and backend.) from your symfony application, remember that you have to install composer on that container and
to allow access to your backend files.
:::

## How it works

The idea behind this plugin is simple and follows the following workflow:

1. The plugin will watch for changes in your PHP files when you are starting vite.
2. When a PHP file changes, the plugin will run the `fos:js-routing:dump` command.
3. The plugin will then inject the generated routes in your entrypoints at build time.
4. If there are new routes, the plugin will initiate a full reload in HMR.

That's it!

## Installation

Run the following commands to add the bundle to your project and the necessary dependencies to your package.json.

```bash
 composer require friendsofsymfony/jsrouting-bundle

 ## NPM requires some additional configuration check the "Additional config for NPM" section below.
 npm install --save-dev ./vendor/friendsofsymfony/jsrouting-bundle/Resources/ # optional

 ## Yarn
 yarn add -D ./vendor/friendsofsymfony/jsrouting-bundle/Resources/ # optional
```

If you are not using Symfony Flex please
follow [this](https://github.com/FriendsOfSymfony/FOSJsRoutingBundle/blob/master/Resources/doc/installation.rst)
installation guide.

## Additional config for NPM

This is meant as a temporary solution until FOS or someone else deploys the package to NPM. You can find the reason
[here](https://github.com/lhapaipai/symfony-vite-dev/pull/24#issuecomment-2184814733).


```js
import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";

export default defineConfig({
  plugins: [symfonyPlugin()],
  // that is for vite dev server
  optimizeDeps: {
    include: ["fos-router"],
  },
  build: {
    rollupOptions: {
      input: {
        app: "./assets/app.js",
      },
    },
    // that is for the build step
    // for the @rollup/plugin-commonjs
    commonjsOptions: {
      include: [
        "vendor/friendsofsymfony/jsrouting-bundle/Resources/public/js/router.js",
        /node_modules/,
      ],
    },
  },
});
```

