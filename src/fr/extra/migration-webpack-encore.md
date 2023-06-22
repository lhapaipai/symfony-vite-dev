# Migration depuis Webpack Encore

## Installation

WebpackEncoreBundle est lié à une recette Symfony. Avant de supprimer ce bundle, sauvegardez votre contenu `assets` et `package.json`/`package-lock.json` dans un autre emplacement. Ils seront supprimés lorsque vous supprimerez le bundle.


```bash
mv assets assets.bak
mv package.json package.json.bak
mv package-lock.json package-lock.json.bak
composer remove symfony/webpack-encore-bundle
```

Vous pouvez renommer votre sauvegarde en toute sécurité et installer le Bundle Vite.

```bash
mv assets.bak assets
mv package.json.bak package.json
mv package-lock.json.bak package-lock.json
composer require pentatrion/vite-bundle
```

Vous devez supprimer les dépendances Webpack
```bash
npm rm @symfony/webpack-encore webpack webpack-cli webpack-notifier

# vous n'aurez probablement plus besoin de ces dépendances non plus
# ouf...
npm rm @babel/core @babel/preset-env core-js regenerator-runtime
```
vérifiez le [package.json](https://github.com/symfony/recipes/blob/main/symfony/webpack-encore-bundle/2.0/package.json) de la recette Webpack Encore Bundle pour vérifier quelles dépendances ne sont pas plus nécessaires.

Après avoir ajouté manuellement les dépendances de développement `vite` et `vite-plugin-symfony` et les `scripts` dans votre `package.json` existant. vérifiez le fichier de référence [package.json](https://github.com/lhapaipai/vite-bundle/blob/main/install/package.json).

Continuez votre configuration en suivant la page [installation](/guide/installation.html#installation).


## Configuration

Il y a quelques différences mineures avec les fonctions Twig.

```diff
// webpack.config.js
-Encore.addEntry("app", "./assets/app.js");
```

```diff
// vite.config.js
+export default {
+    // ...
+    plugins: [
+      symfonyPlugin()
+    ],
+    build: {
+        rollupOptions: {
+            input: {
+                app: "./assets/app.js"
+            },
+        },
+    },
+};
```

```diff
{% block stylesheets %}
-    {{ encore_entry_link_tags('app') }}
+    {{ vite_entry_link_tags("app") }}
{% endblock %}

{% block javascripts %}
-    {{ encore_entry_script_tags('app') }}
+    {{ vite_entry_script_tags("app") }}
{% endblock %}
```


