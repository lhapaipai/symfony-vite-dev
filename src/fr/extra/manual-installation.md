# Installation manuelle

```console
composer require pentatrion/vite-bundle
```

si vous ne souhaitez pas utiliser la recette ou souhaitez voir en profondeur ce qui en est modifié.

- créez une structure de répertoires pour vos fichiers js/css :

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

- ajoutez une route Vite à votre application dev Symfony.
```yaml
# config/routes/dev/pentatrion_vite.yaml
_pentatrion_vite:
    prefix: /build
    resource: "@PentatrionViteBundle/Resources/config/routing.yaml"
```

- créez ou complétez votre [`package.json`](https://github.com/lhapaipai/vite-bundle/blob/main/install/package.json).

- créez un fichier [`vite.config.js`](https://github.com/lhapaipai/vite-bundle/blob/main/install/vite.config.js) sur le répertoire racine de votre projet.

- ajoutez 2 répertoires à votre fichier `.gitignore`

```diff
+ /public/build/
+ node_modules/
```

- continuez votre configuration en suivant la page [installation](/guide/installation.html#installation).
