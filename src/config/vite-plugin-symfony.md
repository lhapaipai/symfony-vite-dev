# Vite plugin Symfony Options

## publicDirectory

- **Type:** `string`
- **Default value:** `public`

Relative path from your project's root folder to your web server's public folder. In some cases it may be `www` or `public_html`.

::: warning
If you set the extension's `publicDirectory` and `buildDirectory` options you don't need to set Vite's `base` and `build.outDir` options.
:::

## buildDirectory

- **Type:** `string`
- **Default value:** `public`

Relative path from your public folder where your files were compiled following a `vite build`.

::: warning
See note above.
:::

## servePublic

- **Type:** `boolean`
- **Default value:** `true`

By default the extension disables the `publicDir` option of the vite configuration. We don't want the full contents of the public folder (index.php entry point, etc.) to be copied into the build folder. (see [discussion](https://github.com/lhapaipai/vite-bundle/issues/17)). By activating this option the extension still activates a local server so that the Vite development server can return the files present in the public folder.

If you still want to use the `publicDir` option quickly, disable this option first.

:::tip
This option will be removed as soon as Vite's `build.copyPublicDir` option is definitively adopted.
:::

## refresh

- **Type:** `boolean | string[]`
- **Default value:** `false`

Allows you to restart the Vite development server when your files are modified. By setting this value to `true`, the server will check for modifications on your Twig files (equivalent to the value `["templates/**/*.twig"]`). You can also define your own pattern table.

Vite uses the [picomatch](https://github.com/micromatch/picomatch) library to interpret the patterns.

## viteDevServerHostname

- **Type:** `null | string`
- **Default value:** `null`

If you have specified the Vite `server.host` option to `0.0.0.0` (especially for Docker) you will probably need to set `viteDevServerHostname` to 'localhost'. See [discussion](https://github.com/lhapaipai/vite-bundle/issues/26).

## debug

- **Type:** `boolean`
- **Default value:** `false`

Displays in the console the complete configuration of Vite when it has been completely resolved (`configResolved`).
