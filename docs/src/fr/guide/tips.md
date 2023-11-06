
# Conseils d'utilisation

Si vous souhaitez installer le bundle sans la recette de la communauté, consultez [l'installation manuelle](/fr/extra/manual-installation.html).

## Fichiers CSS comme point d'entrée

Cette section parle de FOUC (Flash de contenu sans style) pour le développement uniquement. Normalement, ce phénomène ne devrait pas se produire après un processus de construction.

Par défaut si vous importez vos fichiers css à partir du point d'entrée js, le serveur Vite de développement créera un seul point d'entrée (`<script src="http://localhost:5173/build/assets/app.js" type="module"> </script>`) pour vos fichiers js et css. Votre contenu CSS sera chargé après. Il en résulte une période de temps pendant laquelle le contenu de la page ne sera pas stylisé. Cela peut être ennuyeux...

Vous pouvez cependant fournir un fichier css/scss/... comme point d'entrée et il sera directement inséré comme balise de lien `<link rel="stylesheet" href="http://localhost:5173/build/assets/theme. scss">`.
De cette façon, votre navigateur attendra le chargement de votre fichier `theme.scss` avant de lancer le rendu de la page.

```js
export default defineConfig({
    // ...your config
    build: {
        rollupOptions: {
            input: {
                theme: "./assets/theme.scss"
            },
        }
    },
});
```

::: tip
Ajoutez tout de même les 2 fonctions twig vite_entry_link_tags / vite_entry_script_tags
même si le point d'entrée est un fichier css car en mode développement ViteJs aura besoin d'insérer son code js pour activer le HMR.
:::

```twig
{% block stylesheets %}
    {{ vite_entry_link_tags('theme') }}
{% endblock %}

{% block javascripts %}
    {{ vite_entry_script_tags('theme') }}
{% endblock %}
```

rendera
```html
<script src="http://localhost:5173/build/@vite/client" type="module">
<link rel="stylesheet" href="http://localhost:5173/build/assets/theme.scss">
```
during development.

## Docker

Si vous utilisez Docker pour votre développement Symfony et que vous exécutez vos commandes node dans un conteneur, vous aurez besoin de faire quelques ajustements dans la configuration.

prenons l'exemple avec une image `node:21-alpine`.

```bash
docker run
  --rm \
  -ti \
  --user $(id -u):$(id -g) \
  -v $(pwd):/app \
  -p 5173:5173 \
  -w /app \
  node:21-alpine \
  npm run dev
```


```js
// vite.config.js
export default defineConfig({
    server: {
        // nous avons besoin que vite écoute sur toutes les interfaces
        host: '0.0.0.0'
    },
    plugins: [
        symfonyPlugin({
            // comme nous avons spécifié un `server.host` = 0.0.0.
            // nous devons explicitement nommer le server host name
            // à utiliser.
            viteDevServerHostname: 'localhost'
        }),
    ],
    build: {
        rollupOptions: {
            input: {
                app: "./assets/app.js"
            },
        }
    },
});
```

Un exemple de configuration avec Docker peut-être trouvée de les [bacs à sable Symfony Vite Dev](https://github.com/lhapaipai/symfony-vite-dev/tree/main/playground).

Vous pourrez en savoir plus en suivant cette [discussion Github](https://github.com/lhapaipai/vite-bundle/issues/26).

## Préparation des dépendances

Initialement dans un projet Vite, `index.html` est le point d'entrée de votre application. Lorsque vous exécutez votre serveur de développement, Vite analyse votre code source et découvre automatiquement les dépendances dont il aura besoin.

Parce que nous n'avons pas de `index.html`, Vite ne peut pas faire cette étape de `pré-bundling` quand il démarre mais quand vous naviguez sur une page où il trouve un paquet qu'il n'a pas déjà mis en cache. Vite relancera le processus de `pre-bundling` de dependances et rechargera la page.

ce comportement peut être gênant si vous avez beaucoup de dépendances car il crée beaucoup de rechargements de page avant d'arriver au rendu final.

vous pouvez limiter cela en déclarant dans le `vite.config.js` les dépendances les plus courantes de votre projet.

```js
// vite.config.js

export default defineConfig({
    server: {
        //Set to true to force dependency pre-bundling.
        force: true,
    },
    // ...
    optimizeDeps: {
        include: ["my-package"],
    },
});
```
## Configurer le fractionnement des fichier

Vite essaie de diviser vos fichiers js en plusieurs fichiers plus petits partagés entre les points d'entrée. Pour configurer le fractionnement exact, vous pouvez définir une fonction `manualChunks` dans `rollupOptions`, reportez-vous à la [documentation rollup](https://rollupjs.org/configuration-options/#output-manualchunks) pour plus de détails.

```js
// vite.config.js

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string, {getModuleInfo, getModuleIds}) => {
          // your code
        },
      },
    },
  },
});
```

## https / http en développement

Votre serveur de développement Vite peut provoquer un rechargement indésirable s'il est utilisé en http alors que votre application Symfony utilise https (probablement en raison de certificats invalides). La configuration est plus facile si vous développez votre application sans https.


```bash
npm run dev
symfony serve --no-tls
```

rendez-vous alors à cette adresse : `http://127.0.0.1:8000`

si vous souhaitez toujours utiliser https, vous devrez générer des certificats pour votre serveur de développement Vite.

vous pouvez utiliser mkcert : https://github.com/FiloSottile/mkcert

```bash
mkcert -install
mkcert -key-file certs/vite.key.pem -cert-file certs/vite.crt.pem localhost 127.0.0.1

```

```js
// vite.config.js
import fs from "fs";

export default defineConfig({

    // ...
    server: {
        https: {
          key: fs.readFileSync('certs/vite.key.pem'),
          cert: fs.readFileSync('certs/vite.crt.pem'),
        },
        cors: true
    },
});
```

```bash
npm run dev
symfony serve
```

rendez-vous à cette adresse : `https://127.0.0.1:8000`

