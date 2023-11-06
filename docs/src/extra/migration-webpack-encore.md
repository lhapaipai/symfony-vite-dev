# Migration from Webpack Encore

## Install

WebpackEncoreBundle is linked with a Symfony Recipe. Before remove this bundle, backup your `assets` content and `package.json`/`package-lock.json` in another location. They will be deleted when you'll remove the bundle.

```bash
mv assets assets.bak
mv package.json package.json.bak
mv package-lock.json package-lock.json.bak
composer remove symfony/webpack-encore-bundle
```

You can safely rename your backup and install the Vite Bundle.
```bash
mv assets.bak assets
mv package.json.bak package.json
mv package-lock.json.bak package-lock.json
composer require pentatrion/vite-bundle
```

You need to remove Webpack dependencies
```bash
npm rm @symfony/webpack-encore webpack webpack-cli webpack-notifier

# you probably won't need those dependencies either
npm rm @babel/core @babel/preset-env core-js regenerator-runtime
```
check the [package.json](https://github.com/symfony/recipes/blob/main/symfony/webpack-encore-bundle/2.0/package.json) of the Webpack Encore Bundle recipe to check which dependencies are no longer needed.

After you need to add manually the `vite` and `vite-plugin-symfony` dev dependencies and `scripts` in your existant `package.json`. check the [package.json](https://github.com/lhapaipai/vite-bundle/blob/main/install/package.json) reference file.

Continue your configuration following the [installation](/guide/installation.html#installation) page.


## Configuration

There is some minor differences with the Twig functions

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


