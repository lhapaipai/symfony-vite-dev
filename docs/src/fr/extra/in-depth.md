# Comment fonctionne le plugin vite

le rôle principal du plugin est de produire un fichier `entrypoints.json` à partir des points d'entrée configurés dans le fichier `vite.config.js`.

```js
export default defineConfig({
  plugins: [
    symfonyPlugin(),
  ],
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        "app": "./assets/app.js",
        "theme": "./assets/theme.scss"
      }
    },
  },
});
```

Le contenu de ce fichier sera différent en fonction du contexte d'utilisation. Lorsque le serveur de développement de Vite est à l'écoute, les points d'entrée feront référence à des URL vers le serveur de Vite. Par contre à la suite d'une commande de `build`, les points d'entrée feront référence à des fichiers existants.

::: code-group
```json [entrypoints.json (dev)]
{
  "isProd": false,
  "viteServer": {
    "origin": "http://[::1]:5173",
    "base": "/build/"
  },
  "entryPoints": {
    "app": {
      "js": [
        "http://[::1]:5173/build/src/app.ts"
      ]
    },
    "theme": {
      "css": [
        "http://[::1]:5174/build/assets/theme.scss"
      ]
    }

  },
  "legacy": false
}
```
```json [entrypoints.json (prod)]
{
  "entryPoints": {
    "app": {
      "assets": [],
      "css": [
        "/build/assets/app-3443e464.css"
      ],
      "js": [
        "/build/assets/app-6f6529cf.js"
      ],
      "legacy": false,
      "preload": []
    },
    "theme": {
      "assets": [],
      "css": [
        "/build/assets/theme-40a4bec9.css"
      ],
      "js": [],
      "legacy": false,
      "preload": []
    }
  },
  "isProd": true,
  "legacy": false,
  "viteServer": false
}
```
:::

Il existe 2 types de points d'entrée :
- Ceux qui mêlent js et css : toutes les informations sont facilement récupérables en ajoutant un callback sur `generateBundle`.
  Le point d'entrée est matérialisé par un objet de type `OutputChunk`. Voici comment sont récupérés les éléments.
  - assets : `viteMetadata.importedAssets`
  - css : `viteMetadata.importedCss`
  - imports : `imports`
  - preload : `dynamicImports`
- Ceux qui ne contiennent que du css et sont considérés comme css purs (voir plugin [`vite:css-post`](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/css.ts)). Le point d'entrée n'apparaît pas dans le hook `generateBundle`. il est émis en tant que `OutputAsset` et ne possède pas de propriété `facadeModuleId`. Il faut donc récupérer cette correspondance `chunk.facadeModuleId` <-> `chunk.viteMetadata.importedCss` dans le hook `renderChunk`.

# Comment fonctionne ce bundle

```twig
{% block stylesheets %}
    {{ vite_entry_link_tags('app') }}
{% endblock %}

{% block javascripts %}
    {{ vite_entry_script_tags('app') }}
{% endblock %}
```

rendrait en développement:

```html
<!--Nothing with vite_entry_link_tags('app') -->

<!-- vite_entry_script_tags('app') -->
<script src="http://localhost:5173/build/@vite/client" type="module"></script>
<script src="http://localhost:5173/build/app.js" type="module"></script>
```

rendrait en production :

```html
<!-- vite_entry_link_tags('app') -->
<link rel="stylesheet" href="/build/app.[hash].css" />
<link rel="modulepreload" href="/build/vendor.[hash].js" />

<!-- vite_entry_script_tags('app') -->
<script src="/build/app.[hash].js" type="module"></script>
```

Dans un environnement de développement, le bundle agit également comme un proxy en transférant les requêtes qui ne lui sont pas destinées au serveur de développement Vite.
