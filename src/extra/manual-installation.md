# Manual installation

```console
composer require pentatrion/vite-bundle
```

if you do not want to use the recipe or want to see in depth what is modified by it.

- create a directory structure for your js/css files:

```
├──assets
│ ├──app.js
│ ├──app.css
│...
├──public
├──composer.json
├──package.json
├──vite.config.js
```

- add vite route to your dev Symfony app.
```yaml
# config/routes/dev/pentatrion_vite.yaml
_pentatrion_vite:
    prefix: /build
    resource: "@PentatrionViteBundle/Resources/config/routing.yaml"
```

- create or complete your [`package.json`](https://github.com/lhapaipai/vite-bundle/blob/main/install/package.json).

- create a [`vite.config.js`](https://github.com/lhapaipai/vite-bundle/blob/main/install/vite.config.js) file on your project root directory.

- add 2 directories to your `.gitignore` file

```diff
+ /public/build/
+ node_modules/
```

- continue your configuration following the [installation](/guide/installation.html#installation) page.
