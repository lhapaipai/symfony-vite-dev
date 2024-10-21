# Bien démarrer

Vite <img src="/images/logo-vite.svg" width="16" height="16" style="display: inline;" /> est un outils permettant de faciliter l'expérience de développement des projets web modernes.

Il met à disposition :

- un **serveur de développement** qui permet entre autre le remplacement à chaud 🔥 du code généré en tirant partie des modules EcmaScript.

- une **commande de génération de code** qui utilise [Rollup <img src="/images/logo-rollup.svg" width="16" height="16" style="display: inline;" />](https://rollupjs.org/).

## Comment Vite fonctionne-t-il ?

Par défaut, Vite utilise un fichier `index.html` comme point d'entrée de votre application.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Vite Project</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./src/main.ts"></script>
  </body>
</html>
```

## 💻 Serveur de développement

Lorsque vous lancez Vite en développement avec `npx vite`, celui-ci lancera un serveur HTTP sur le port 5173 et servira votre fichier `index.html` en réécrivant les urls de vos balises `<script>` et assets.

Ainsi, une requête à l'adresse : `curl http://localhost:5173` renverra votre fichier `index.html` avec le code suivant.

```html{4,10}
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module" src="/@vite/client"></script>
    <meta charset="UTF-8" />
    <title>Vite in Dev mode</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Le code renvoyé par `http://localhost:5173/src/main.ts` correspond au script de votre point d'entrée compilé.
Celui renvoyé par `http://localhost:5173/@client/client` correspond au script mettant en place un WebSocket entre votre navigateur et le serveur de Vite. Ce dernier permet le remplacement à chaud de votre code pour optimiser votre expérience de développement.

## 📦 Compilation pour la production

Enfin, lorsque vous lancez la compilation de votre code avec `npx vite build`, Vite s'appuiera sur Rollup et générera un fichier `index.html` de cette forme.

```html{6,7}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Vite Build</title>
    <script type="module" crossorigin src="/assets/index-aa676a50.js"></script>
    <link rel="stylesheet" href="/assets/index-3443e464.css">
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

## <img src="/symfony-vite.svg" width="24" height="24" style="display: inline; vertical-align: -10%;" /> Comment intégrer Vite dans un application Symfony ?

Le fonctionnement de Vite est piloté par la réécriture des balises `<script>` et `<link>`, il serait donc intéressant de déplacer cette logique dans des fonctions Twig.

Dans le fichier de configuration de Vite, on définit le point d'entrée `app` de notre application.

```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      app: './path/to/app.js',
    },
  },
})
```

Et faisons ensuite référence à ce point d'entrée dans nos modèles `twig`.

```html{6,7}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Vite Build</title>
    {{ vite_entry_script_tags('app') }}
    {{ vite_entry_link_tags('app') }}
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

En fonction du contexte d'utilisation (développement ou production) les fonctions Twig renverront soit une référence au serveur de développement de Vite ou bien à des fichiers statiques générés après une étape de compilation.

Pour plus d'infos sur l'intégration voir [Backend integration](https://vitejs.dev/guide/backend-integration.html).


## Les extensions `vite-plugin-symfony` et `pentatrion/vite-bundle`.

L'extension `vite-plugin-symfony` pour Vite et le bundle Symfony `pentatrion/vite-bundle` fonctionnent ensemble afin d'apporter une solution pour cette intégration.

La fonction principale de `vite-plugin-symfony` est de générer un fichier `entrypoints.json`. À la manière du fichier `manifest.json`, il contiendra toutes les informations sur nos points d'entrée pour un traitement côté serveur. Ce fichier renverra un contenu différent si votre serveur de développement Vite est démarré ou bien si vos fichiers ont été compilés.

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
    }
  },
  "isProd": true,
  "legacy": false,
  "viteServer": false
}
```
:::

Quant à lui, le bundle Symfony `pentatrion/vite-bundle` se chargera principalement de mettre à disposition les 2 fonctions Twig `vite_entry_script_tags` et `vite_entry_link_tags`. Sous le capot ces 2 fonctions vont analyser le fichier `entrypoints.json` généré et renverront les balises `<script>` et `<link>` appropriées.

::: code-group
```twig [index.html.twig]
{{ vite_entry_script_tags('app') }}
{{ vite_entry_link_tags('app') }}
```
```html [index.html (dev)]
<script type="module" src="http://[::1]:5173/@vite/client"></script>
<script type="module" src="http://[::1]:5173/build/src/app.ts"></script>
```
```html [index.html (prod)]
<script type="module" crossorigin src="/assets/app-6f6529cf.js"></script>
<link rel="stylesheet" href="/assets/app-3443e464.css">
```
:::

Maintenant que nous avons vu la théorie, voyons comment installer tout cela dans votre application Symfony !

## Diagramme de l'infrastructure

![vite fonctionnement](/graphs/vite.svg)
