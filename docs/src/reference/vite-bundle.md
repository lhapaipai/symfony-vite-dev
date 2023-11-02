# Vite bundle Options

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
- **Valeur par défaut :** `false`

Generates full URLs of your generated js/css/assets files (schema + domain + path).

## throw_on_missing_entry

- **Type:** `boolean`
- **Default value:** `false`

By default, vite-bundle will silently ignore your calls to entry points that are not present in your `entrypoints.json`. By setting this option to `true`, Symfony will throw an exception in such cases.

## script_attributes

- **Type:** `associative array`
- **Default value:** `[]`

Specify here your attributes that you want to appear on all your HTML `<script>` tags.

```yaml
pentatrion_vite:
  script_attributes:
    defer: true
    referrerpolicy: origin
```

## link_attributes

- **Type:** `associative array`
- **Default value:** `[]`

Specify here your attributes that you want to appear on all your HTML `<style>` tags.

```yaml
pentatrion_vite:
  link_attributes:
    referrerpolicy: origin
```

## default_config

- **Type:** `null | string`
- **Default value:** `null`

If you have defined several Vite configurations.

::: warning
In the case of a multiple configuration, it will be necessary to leave the `build_directory`, `script_attributes` and `link_attributes` options empty and define them in the `builds` option which will follow.
:::

## builds

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
```
