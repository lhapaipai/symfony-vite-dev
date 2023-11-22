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

You can also specify a configuration object.

```ts
type VitePluginSymfonyStimulusOptions = {
  /**
   * path to controllers.json relative to vite root
   * @default ./assets/controller.json
   */
  controllersFilePath: string;

  /**
   * enable hmr for controllers
   * @default true
   */
  hmr: boolean;
}
```

:::warning
By default, HMR is activated on your Stimulus controllers. If these are not idempotent (see [Stimulus doc](https://turbo.hotwired.dev/handbook/building#making-transformations-idempotent)), you may encounter problems (HMRs will not work as expected and you will have to manually refresh your page). In this case it is preferable to deactivate the `hmr: false` option. Therefore, any modification of the file will still result in an automatic refresh of the page.
:::

## viteDevServerHostname

- **Type:** `null | string`
- **Default value:** `null`

If you have specified the Vite `server.host` option to `0.0.0.0` (especially for Docker) you will probably need to set `viteDevServerHostname` to 'localhost'. See [discussion](https://github.com/lhapaipai/vite-bundle/issues/26).
