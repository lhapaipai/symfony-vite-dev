# Stimulus <img src="/images/logo-stimulus.svg" width="24" height="24" style="display: inline;" />

## Installation

Stimulus est un framework Javascript léger qui a comme ambition de faciliter l'intégration de composants JavaScript dans un projet. Il connecte des objets JavaScript appelés `controllers` aux éléments HTML d'une page via les attributs `data-*`.

```bash
composer require symfony/stimulus-bundle
```

:::info
Lorsque vous ajoutez ce bundle, le paquet npm `@symfony/stimulus-bridge` est automatiquement ajoutée en tant que dépendance de développement. Cette dépendance n'est pas utilisée dans notre cas car liée à Webpack, ignorez la simplement. (cela ne sert à rien de la supprimer car elle sera à nouveau ajoutée lors de votre prochain `composer install`).
:::


```js
// vite.config.js
import { defineConfig } from 'vite'
import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
  plugins: [
    symfonyPlugin({
      // un booléen pour activer stimulus avec les options par défaut
      stimulus: true // [!code ++]

      // ou précisez le chemin de votre controllers.json
      stimulus: './assets/other-dir/controllers.json' // [!code ++]

      // vous pouvez aussi spécifier un objet de configuration [!code ++]
      stimulus: { // [!code ++]
        fetchMode: "lazy" // [!code ++]
      } // [!code ++]
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

Si vous voulez connaître toutes les options disponibles, consultez la page de [référence](/fr/stimulus/reference).

Si vous utilisez TypeScript. Ajoutez ces définitions de types pour le `import.meta.stimulusXXX` et les imports de type `*?stimulus` dans un fichier `env.d.ts`.

```ts
/// <reference types="vite-plugin-symfony/stimulus/env" />
```


Si vous avez exécuté la recette Flex l'import a certainement déjà été ajouté.

```js
// assets/app.js
import './bootstrap.js';
```

Ajoutez les routines de génération d'une application stimulus compatible avec `symfony/stimulus-bundle` et `vite`.

:::code-group
```js [assets/bootstrap.js]
import { startStimulusApp, registerControllers } from "vite-plugin-symfony/stimulus/helpers";

const app = startStimulusApp();
registerControllers(
  app,
  import.meta.glob('./controllers/*_controller.js', {
    query: "?stimulus",
    /**
     * toujours à true, la comportement `lazy` est géré en interne avec
     * import.meta.stimulusFetch (voir référence)
     */
    eager: true,
  })
)
```
```ts [assets/bootstrap.ts]
import { startStimulusApp, registerControllers } from "vite-plugin-symfony/stimulus/helpers";

const app = startStimulusApp();
registerControllers(
  app,
  import.meta.glob<StimulusControllerInfosImport>(
    "./controllers/*_controller.ts",
    {
      query: "?stimulus",
      /**
       * toujours à true, la comportement `lazy` est géré en interne avec
       * import.meta.stimulusFetch (voir référence)
       */
      eager: true,
    },
  ),
);
```
:::


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
{# in some template #}
<h1 {{ stimulus_controller('welcome') }}></h1>
```
```js
// ./assets/controllers/welcome_controller.js
import { Controller } from "@hotwired/stimulus";

import.meta.stimulusFetch = "eager";
import.meta.stimulusIdentifier = "welcome";

export default class controller extends Controller {

  static targets = ["title"];
  static values = {
    name: String,
  };
  connect() {
    this.titleTarget.textContent = `hello ${this.nameValue}`;
  }
}
```

:::warning
Veuillez noter que pour que le HMR fonctionne correctement, votre fichier d'initialisation (le fichier qui appelle la fonction `startStimulusApp`) doit être nommé `bootstrap.js` ou `bootstrap.ts`. Si vous avez nommé votre fichier autrement, vous devrez ajouter manuellement ces quelques lignes.

```diff
// assets/stimulus.js
import { startStimulusApp } from "vite-plugin-symfony/stimulus/helpers";
const app = startStimulusApp();

// some logic

+ if (import.meta.hot) {
+   window.$$stimulusApp$$ = app;
+ }
```
:::
## Exemples

Le dépôt de développement [lhapaipai/symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) contient un dossier `playground/stimulus-basic` et un autre `playground/stimulus` regroupant une implémentation complète de Stimulus avec Symfony UX.


```bash
git clone https://github.com/lhapaipai/symfony-vite-dev.git
cd symfony-vite-dev

# installe les dépendances de vite-bundle
# compile vite-plugin-symfony
make install

cd playground/stimulus-basic
# ou bien pour Symfony UX
cd playground/stimulus

composer install
symfony serve
pnpm dev
```
