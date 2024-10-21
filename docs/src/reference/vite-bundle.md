# Vite bundle options <img src="/images/logo-packagist.svg" width="28" height="32" style="display: inline; vertical-align: -10%; " />

The configuration of the bundle is located in the file `config/packages/pentatrion_vite.yaml`.

```yaml
pentatrion_vite:
  public_directory: public
  build_directory: build
  throw_on_missing_entry: true
  # etc...
```

## public_directory

- **Type:** `string`
- **Default value:** `public`

Path to the web root relative to the Symfony project root directory. In some cases it may be `www` or `public_html`.

## build_directory

- **Type:** `string`
- **Default value:** `build`

Path to your compiled files relative to the web root directory.

## proxy_origin

- **Type:** `null | string`
- **Default value:** `null`

When using Docker, you may want to specify a different origin if you start your Vite development server outside of your Docker container. (eg. `http://host.docker.internal:5173`).

## absolute_url

- **Type :** `boolean`
- **Default value :** `false`

Generates full URLs of your generated js/css/assets files (schema + domain + path).

## throw_on_missing_asset

- **Type:** `boolean`
- **Default value:** `true`

By default, vite-bundle will throw an exception if you use the Twig `asset()` function with a path that is not present in the `manifest.json` file, in some cases plugins can copy static files without them being referenced in the manifest, you will need to set the value to `false` to be able to use them.

```js
import { defineConfig } from 'vite'

import symfonyPlugin from 'vite-plugin-symfony';
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "assets/images/angular.svg",
          dest: "static"
        }
      ]
    }),
    symfonyPlugin(),
  ],
  // ...
});
```
```yaml
# config/packages/framework.yaml
framework:
    assets:
        version_strategy: 'Pentatrion\ViteBundle\Asset\ViteAssetVersionStrategy'
```
```twig
<img src="{{ asset('static/angular.svg')}}" />
```

## throw_on_missing_entry

- **Type:** `boolean`
- **Default value:** `false`

By default, vite-bundle will silently ignore your calls to entry points that are not present in your `entrypoints.json`. By setting this option to `true`, Symfony will throw an exception in such cases.

## cache

- **Type :** `boolean`
- **Default value :** `false`

Enables caching of `entrypoinst.json` and `manifest.json` files. Should only be enabled in production.

```yaml
# config/packages/pentatrion_vite.yaml
when@prod:
    pentatrion_vite:
        cache: true
```

The creation of an optimal cache is done in the warm-up step (otherwise a php cache will be created per file).l'étape de warm-up
```bash
npm run build

# clear the cache and perform a warm-up
# important this step must take place after the `npm run build`
symfony console cache:clear
```

For more information see the [performance](/guide/performance#caching-configuration-files).

## preload

- **Type :** `"none"` | `"link-tag"` | `"link-header"`
- **Default value :** `link-tag`

Defines the strategy for preloading your files.


With `"link-tag"`, your JS dependencies will be preloaded using a `<link rel="modulepreload">` tag.

With `"link-header"`, automatically preload all rendered scripts and link tags via the http2 Link header. Requires the Symfony component [symfony/web-link](https://github.com/symfony/web-link).

For more details, see the [performance](/guide/performance#preloading-your-scripts) section.

## crossorigin

- **Type :** `false` | `true` | `"anonymous"` | `"use-credentials"`
- **Default value :** `true`

If you specify this option, a `crossorigin` attribute will be added to all tags: `<script>`, `<link rel="stylesheet">`, `<link rel="modulepreload">` and internal tags of Vite.

If you specified multiple configuration with `configs`, this option will be applied to **all** of your configurations.


## script_attributes

- **Type:** `associative array`
- **Default value:** `[]`

Specify here your attributes that you want to appear on all your HTML `<script>` tags. Note: Vite JS internal `<script>` tags like `<script type="module" src="http://127.0.0.1:5176/build/@vite/client"></script>` will not be affected.

```yaml
pentatrion_vite:
  script_attributes:
    defer: true
    referrerpolicy: origin
```

If you still want to work on the attributes of Vite's internal tags, you can listen to the event: `Pentatrion\ViteBundle\Event\RenderAssetTagEvent`, see [custom attributes](/guide/custom-attributes).

## link_attributes

- **Type:** `associative array`
- **Default value:** `[]`

Specify here the attributes that you want to appear on all your HTML `<link rel="stylesheet">` tags (Please note your `<link rel="modulepreload">` tags will not be affected).

```yaml
pentatrion_vite:
  link_attributes:
    referrerpolicy: origin
```

## preload_attributes

- **Type :** `associative array`
- **Default value :** `[]`

Specify here the attributes you want to appear on all your HTML tags `<link rel="modulepreload">`.

```yaml
pentatrion_vite:
  preload_attributes:
    referrerpolicy: origin
```


## default_config

- **Type:** `null | string`
- **Default value:** `null`

If you have defined several Vite configurations.

::: warning
In the case of a multiple configuration, it will be necessary to leave empty the `build_directory`, `script_attributes` `link_attributes` and `preload_attributes` options and define them in the `configs` option which will follow.
:::

## configs

- **Type:** `associative array of build config`
- **Default value:** `[]`

```yaml
pentatrion_vite:
  default_config: <custom-build-name-1>
  builds:
    <custom-build-name-1>:

      build_directory: config1

      script_attributes:
        # etc

      link_attributes:
        # etc

      preload_attributes:
        # etc
```


## <del>default_build</del>

- **Type:** `null | string`
- **Default value:** `null`
- **Deprecated** (will be removed in v6.x)

::: warning
This option is deprecated, use `default_config` instead.
:::

If you have defined several Vite configurations.

::: warning
In the case of a multiple configuration, it will be necessary to leave the `build_directory`, `script_attributes` and `link_attributes` options empty and define them in the `builds` option which will follow.
:::

## <del>builds</del>

- **Type:** `associative array of build config`
- **Default value:** `[]`
- **Deprecated** (will be removed in v6.x)

::: warning
This option is deprecated, use `configs` instead.
:::


```yaml
pentatrion_vite:
  default_build: <custom-build-name-1>
  builds:
    <custom-build-name-1>:

      build_directory: build1

      script_attributes:
        # etc

      link_attributes:
        # etc
```
