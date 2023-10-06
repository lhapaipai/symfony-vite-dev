# Vite plugin Symfony Options

## debug

- **Type:** `boolean`
- **Default value:** `false`

Displays in the console the complete configuration of Vite when it has been completely resolved (`configResolved`).

## originOverride

- **Type:** `null | string`
- **Default value:** `null`

Override the origin for every dev entrypoint. Useful when you use a proxy server. If you have specified the Vite `server.host` option to `0.0.0.0` (especially for Docker) you will probably need to set `originOverride` to `http://localhost`.

## refresh

- **Type:** `boolean | string[]`
- **Default value:** `false`

Allows you to restart the Vite development server when your files are modified. By setting this value to `true`, the server will check for modifications on your Twig files (equivalent to the value `["templates/**/*.twig"]`). You can also define your own pattern table.

Vite uses the [picomatch](https://github.com/micromatch/picomatch) library to interpret the patterns.

## servePublic

- **Type:** false | string
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


## enforcePluginOrderingPosition

- **Type:** `boolean`
- **Default value:** `true`

Forces the plugin to be executed at the end. This guarantees that all files will be processed and in particular allows us to generate the correct hashes of our files if we wish to add integrity attributes to our scripts. if you deactivate this option the symfony plugin will be executed in the order where it was declared.


## <del>publicDirectory</del>

- **Type:** `string`
- **Default value:** `"public"`
- **Deprecated** (will be removed in v5.x)

Relative path from your project's root folder to your web server's public folder. In some cases it may be `www` or `public_html`.

::: warning
`publicDirectory` is deprecated, you need to set `base` and `build.outDir` directly from Vite config.
```js
export default defineConfig({
  plugins: [
    symfonyPlugin({
      buildDirectory: "build", // [!code --]
      publicDirectory: "public", // [!code --]
    }),
  ],
  base: "/build/" // [!code ++]
  build: {
    outDir: "public/build" // [!code ++]
  },
});
```
:::

## <del>buildDirectory</del>

- **Type:** `string`
- **Default value:** `"build"`
- **Deprecated** (will be removed in v5.x)

Relative path from your public folder where your files were compiled following a `vite build`.

::: warning
See note above.
:::

## <del>viteDevServerHostname</del>

- **Type:** `null | string`
- **Default value:** `null`
- **Deprecated** (will be removed in v5.x)

If you have specified the Vite `server.host` option to `0.0.0.0` (especially for Docker) you will probably need to set `viteDevServerHostname` to 'localhost'. See [discussion](https://github.com/lhapaipai/vite-bundle/issues/26).
