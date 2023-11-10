# Stimulus

::: warning
⚠️ L'implémentation est encore expérimentale. Le code est totalement fonctionnel, certaines implémentations avec Symfony UX ne sont pas terminées (voir tableau des compatibilité en pied de page) et certains noms de fonctions peuvent être amenés à changer. Les fonctionnalités présentées dans cette page ne respecteront pas la sémantique de gestion de version `semver`.
:::

## Introduction

Stimulus est un framework Javascript léger qui a comme ambition de faciliter l'intégration de composants JavaScript dans un projet. Il connecte des objets JavaScript appelés `controllers` aux éléments HTML d'une page via les attributs `data-*`.

## Installation

```bash
composer require symfony/stimulus-bundle

# désinstallez le package @symfony/stimulus-bridge
# uniquement compatible webpack
npm rm @symfony/stimulus-bridge
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
  plugins: [
    symfonyPlugin({
      stimulus: true // [!code ++]

      // ou précisez le chemin de votre controllers.json
      // stimulus: './assets/other-dir/controllers.json'
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        "app": "./assets/app.js",
      }
    }
  },
});
```

Si vous avez exécuté la recette Flex l'import a certainement déjà été ajouté.

```js
// assets/app.js
import './bootstrap.js';
```

Ajoutez les routines de génération d'une application stimulus compatible avec `symfony/stimulus-bundle` et `vite`.

```js
// assets/bootstrap.js

import { startStimulusApp } from "vite-plugin-symfony/stimulus/helpers"
const app = startStimulusApp(
  import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?')
);
```
```twig
{# base.html.twig #}

{% block stylesheets %}
  {{ vite_entry_link_tags('app') }}
{% endblock %}

{% block javascripts %}
  {{ vite_entry_script_tags('app') }}
{% endblock %}
```
```twig
{# dans un gabarit #}
<h1 {{ stimulus_controller('hello') }}></h1>
```

## Exemples

Le dépôt de développement [lhapaipai/symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) contient un dossier `playground/stimulus` regroupant une implémentation complète de Stimulus avec Symfony UX.

## Explications

Afin de faciliter l'intégration de Stimulus dans les applications Symfony, ce dernier a créé un bundle spécifique `symfony/stimulus-bundle`. Ce bundle ajoute :

- des fonctions et filtres Twig pour générer facilement des attributs `data-*`
- des services pour créer des `data-*` attributs compatible Stimulus et les utiliser dans vos propres services.
- un système de chargement automatique et paresseux des controlleurs Stimulus via un paquet npm `@symfony/stimulus-bridge` lié au bundle. Ce dernier va analyser
  - le fichier `assets/controllers.json` pour vos contrôleurs tiers
  - les contrôleurs stockés dans un dossier `assets/controllers`
et renverra du code pour que l'application Stimulus se précharge automatiquement

Par dessus cela Symfony a construit tout un éco-système `Symfony UX` basé sur des bundles qui intègrent chacun d'eux des contrôleurs `Stimulus`.

Le paquet npm `@symfony/stimulus-bridge` n'étant pas compatible avec Vite:
  - utilisation de `require.context`
  - utilisation de loaders `webpack`

le plugin `vite-plugin-symfony` vient ici en remplacement de `@symfony/stimulus-bridge` et assure le pont entre `symfony/stimulus-bundle`, `Symfony UX` et `Vite`.

## Différences avec l'implémentation originale.

Si vous souhaitez définir vos propres contrôleurs avec un chargement paresseux.

```js
// assets/controllers/welcome_controller.js
import { Controller } from '@hotwired/stimulus';

// N'EST PAS COMPATIBLE !
/* stimulusFetch: 'lazy' */ // [!code --]
export default class extends Controller {
    // ...
}
```

Suffixez plutôt le nom de votre controleur avec `_lazycontroller.js` :

```js
// assets/controllers/welcome_lazycontroller.js // [!code ++]
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    // ...
}
```

### Contrôleurs tiers

Le loader webpack de `@symfony/stimulus-bridge` ne peut être utilisé.

```js
// N'EST PAS COMPATIBLE !
import Clipboard from '@symfony/stimulus-bridge/lazy-controller-loader?lazy=true!stimulus-clipboard'; // [!code --]
const app = startStimulusApp(require.context(
    // ...
));

// manière habituelle
app.register('clipboard', Clipboard);
```

Chargez plutôt ces contrôleurs avec le fichier `controllers.json`

```json
{
    "controllers": {
        "stimulus-clipboard": {     // nom du paquet npm
            "stimulus-clipboard": { // id du contrôleur

                // pour empêcher les collisions, Symfony génère
                // un nom final de controleur : <package-name>--<controller-name>
                // définissez ici votre propre nom
                "name": "stimulus-clipboard",
                "enabled": true,
                "fetch": "lazy" // [!code ++]
            }
        }
    },
    "entrypoints": []
}
```

## Symfony UX

| UX packages                    | Compatibility |
|--------------------------------|---------------|
| ux-autocomplete                | ✅            |
| ux-chartjs                     | ✅            |
| ux-cropperjs                   | ✅            |
| ux-dropzone                    | ✅            |
| ux-lazy                        | ✅            |
| ux-live-component              | Not Tested    |
| ux-notify                      | Not Tested    |
| ux-react                       | ✅ (*) hmr : js->(ok) css->(fail) |
| ux-svelte                      | ✅ (*) hmr : js->(refresh page but state lost) css->(ok)           |
| ux-swup                        | ✅            |
| ux-toggle                      | ✅            |
| ux-translator                  | ✅            |
| ux-turbo (not tested)          | Not Tested    |
| ux-twig                        | ✅            |
| ux-typed                       | ✅            |
| ux-vue                         | ✅ (*) hmr : js->(ok) css->(ok) |

(*) demande quelques modifications de code

### symfony/ux-vue

Après l'installation de la recette Flex de `symfony/ux-vue` vous aurez besoin de corriger ces lignes.

```js
// assets/bootstrap.js
import { startStimulusApp } from "vite-plugin-symfony/stimulus/helpers"

import { registerVueControllerComponents } from '@symfony/ux-vue'; // [!code --]
import { registerVueControllerComponents } from "vite-plugin-symfony/stimulus/helpers" // [!code ++]

registerVueControllerComponents(require.context('./vue/controllers', true, /\.vue$/)); // [!code --]
registerVueControllerComponents(import.meta.glob('./vue/controllers/**/*.vue')) // [!code ++]

const app = startStimulusApp(import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?'));
```

```js
// vite.config.js
import { defineConfig } from 'vite'

import symfonyPlugin from 'vite-plugin-symfony';
import vuePlugin from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vuePlugin(), // [!code ++]
    symfonyPlugin({
      stimulus: true
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        "app": "./assets/app.js",
      }
    },
  },
});
```


### symfony/ux-react

Après avoir installé la recette Flex depuis `symfony/ux-react`, vous devrez corriger ces lignes.

```js
// assets/bootstrap.js
import { startStimulusApp } from "vite-plugin-symfony/stimulus/helpers"

import { registerReactControllerComponents } from '@symfony/ux-react'; // [!code --]
import { registerReactControllerComponents } from "vite-plugin-symfony/stimulus/helpers" // [!code ++]

registerReactControllerComponents(require.context('./react/controllers', true, /\.(j|t)sx?$/)); // [!code --]
registerReactControllerComponents(import.meta.glob('./react/controllers/**/*.[jt]s(x)\?')); // [!code ++]


const app = startStimulusApp(import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?'));
```

Étant donné que le composant React est déjà importé paresseusement, vous devez définir fetch `eager` (sinon votre composant deviendra **vraiment trop paresseux**).

```json
{
    "controllers": {
        "@symfony/ux-react": { // [!code --]
        "vite-plugin-symfony": { // [!code ++]
            "react": {
                "enabled": true,
                "fetch": "lazy" // [!code --]
                "fetch": "eager" // [!code ++]
            }
        },

    },
    "entrypoints": []
}
```
```js
// vite.config.js
import { defineConfig } from 'vite'

import symfonyPlugin from 'vite-plugin-symfony';
import reactPlugin from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    reactPlugin(), // [!code ++]
    symfonyPlugin({
      stimulus: true
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        "app": "./assets/app.js",
      }
    },
  },
});
```
```twig
{{ vite_entry_link_tags('app') }}
{{ vite_entry_script_tags('app', {
    dependency: 'react' // [!code ++]
  }) }}
```

### symfony/ux-svelte

Après avoir installé la recette Flex depuis `symfony/ux-svelte`, vous devrez corriger ces lignes.


```js
// assets/bootstrap.js
import { startStimulusApp } from "vite-plugin-symfony/stimulus/helpers"

import { registerSvelteControllerComponents } from '@symfony/ux-svelte'; // [!code --]
import { registerSvelteControllerComponents } from "vite-plugin-symfony/stimulus/helpers" // [!code ++]

registerSvelteControllerComponents(require.context('./svelte/controllers', true, /\.svelte$/)); // [!code --]
registerSvelteControllerComponents(import.meta.glob('./svelte/controllers/**/*.svelte')); // [!code ++]


const app = startStimulusApp(import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?'));
```

Étant donné que le composant Svelte est déjà importé paresseusement, vous devez définir fetch `eager` (sinon votre composant deviendra **vraiment trop paresseux**).

```json
{
    "controllers": {
        "@symfony/ux-svelte": { // [!code --]
        "vite-plugin-symfony": { // [!code ++]
            "svelte": {
                "enabled": true,
                "fetch": "lazy" // [!code --]
                "fetch": "eager" // [!code ++]
            }
        },

    },
    "entrypoints": []
}
```

```js
// vite.config.js
import { defineConfig } from 'vite'

import symfonyPlugin from 'vite-plugin-symfony';
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [
    svelte(), // [!code ++]
    symfonyPlugin({
      stimulus: true
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        "app": "./assets/app.js",
      }
    },
  },
});
```

```js
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
}
```
