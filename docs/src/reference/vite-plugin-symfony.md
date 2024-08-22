# Vite plugin Symfony options <img src="/images/logo-npm.svg" width="39" height="15" style="display: inline; vertical-align: -10%; " />

## debug

- **Type:** `boolean`
- **Default value:** `false`

Displays in the console the complete configuration of Vite when it has been completely resolved (`configResolved`).


## enforcePluginOrderingPosition

- **Type:** `boolean`
- **Default value:** `true`

Forces the plugin to be executed at the end. This guarantees that all files will be processed and in particular allows us to generate the correct hashes of our files if we wish to add integrity attributes to our scripts. if you deactivate this option the symfony plugin will be executed in the order where it was declared.


## enforceServerOriginAfterListening

- **Type :** `boolean`
- **Default value:** `true`

by default any asset import is resolved on the Vite server without specifying the origin.

```js
import logo from './assets/logo.svg'
// see https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/asset.ts#L289

console.log(logo);
// '/build/assets/logo.svg'
```
This turns out to be problematic when used with Symfony because it is the Symfony php server which will be at the origin of the request and it will not be able to resolve the path. Until v5, `pentatrion/vite-bundle` forwarded the request to vite by proxy. With this option, your assets will be resolved more quickly because they will not pass through Symfony.

If you encounter problems displaying resources because you are in specific environments (Docker for example), you may need to deactivate this option.

## exposedEnvVars

- **Type:** `string[]`
- **Default value:** `["APP_ENV"]`

By default, Vite exposes a number of environment variables through the `import.meta.env` object: `MODE`, `BASE_URL`, `PROD`, `DEV`, `SSR`.

It also reads `.env` / `.env.local` / `.env.[mode]` / `.env.[mode].local` files and extracts the associated environment variables.

For security reasons only variables prefixed with `VITE_` are exposed.
In some cases you will want to be able to access other variables. Just add them here.

:::warning
Be careful to distinguish between these 3 extracted environment variables.

- `import.meta.env.PROD`: {boolean}  whether the app is running in production (running the dev server with NODE_ENV='production' or running an app built with NODE_ENV='production')
- `import.meta.env.DEV`: {boolean} whether the app is running in development (always the opposite of `import.meta.env.PROD`)
- `import.meta.env.APP_ENV`: computed value from files `.env`, `.env.local`, etc...

Finally in the same way, pay attention to the interpretation of the `.env.[mode]` files where `mode` will be evaluated according to `NODE_ENV` by vite and according to `APP_ENV` by Symfony. So it's better to abstain 🤯. Vite documentation [Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html).
:::

:::info
There is also the `envPrefix` option for Vite. But it is less flexible: [Vite Shared options: envPrefix](https://vitejs.dev/config/shared-options.html#envprefix).
:::

## originOverride

- **Type:** `null | string`
- **Default value:** `null`

Override the origin for every dev entrypoint. Useful when you use a proxy server. If you have specified the Vite `server.host` option to `0.0.0.0` (especially for Docker) you will probably need to set `originOverride` to `http://localhost`. If you want to specify the scheme, host and port, use `originOverride` otherwise prefer `viteDevServerHostname`.

## refresh

- **Type:** `boolean | string[]`
- **Default value:** `false`

Allows you to restart the Vite development server when your files are modified. By setting this value to `true`, the server will check for modifications on your Twig files (equivalent to the value `["templates/**/*.twig"]`). You can also define your own pattern table.

Vite uses the [picomatch](https://github.com/micromatch/picomatch) library to interpret the patterns.

## servePublic

- **Type:** `boolean` | string
- **Default value:** 'public'

By default the extension disables the `publicDir` option of the vite configuration. We don't want the full contents of the public folder (index.php entry point, etc.) to be copied into the build folder. (see [discussion](https://github.com/lhapaipai/vite-bundle/issues/17)). By activating this option the extension still activates a local server so that the Vite development server can return the files present in the public folder.

If you still want to use the Vite `publicDir` option, disable this option first.

:::tip
This option will be removed as soon as Vite's `build.copyPublicDir` option is definitively adopted.
:::


## sriAlgorithm

- **Type:** `false | "sha256" | "sha384" | "sha512"`
- **Default value:** `false`

Generates hash keys when generating your files. Use if you want to deploy your assets to a CDN.


## stimulus

- **Type:** `boolean | string | VitePluginSymfonyStimulusOptions`
- **Default value:** `false`

Enables the bridge that will interpret the `assets/controllers.json` file for third-party Stimulus controllers (including Symfony UX).

Enter `true` if your file is located in the default location `assets/controllers.json` otherwise specify the path to your reference file.

You can also specify a configuration object of type `VitePluginSymfonyStimulusOptions`. to see the options in detail see the [Stimulus reference](/stimulus/reference) section.


## viteDevServerHostname

- **Type:** `null | string`
- **Default value:** `null`

If you have specified the Vite `server.host` option to `0.0.0.0` (especially for Docker) you will probably need to set `viteDevServerHostname` to 'localhost'. See [discussion](https://github.com/lhapaipai/vite-bundle/issues/26).
