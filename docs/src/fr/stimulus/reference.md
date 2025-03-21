# Référence

## Configuration de Stimulus depuis le plugin Vite

Vous pouvez configurer Stimulus depuis le plugin `vite-plugin-symfony` avec la propriété `stimulus`.

```ts
// vite.config.js
import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";

export default defineConfig({
  plugins: [
    symfonyPlugin({
      // un booléen pour activer stimulus avec les options par défaut
      stimulus: true // [!code ++]

      // ou précisez le chemin de votre controllers.json
      stimulus: './assets/other-dir/controllers.json' // [!code ++]

      stimulus: { // [!code ++]
        /* vos options */ // [!code ++]
      } satisfies VitePluginSymfonyStimulusOptions, // [!code ++]
    }),
  ],
  // ...
});
```

```ts
type VitePluginSymfonyStimulusOptions = {
  /**
   * chemin vers le dossier le plus profond qui contient les controleurs stimulus
   * relativement à vite root
   * @default "./assets/controllers"
   */
  controllersDir: string;

  /**
   * chemin vers le fichier controllers.json relativement à vite root
   * @default "./assets/controller.json"
   */
  controllersFilePath: string;

  /**
   * enable hmr for controllers
   * @default true
   */
  hmr: boolean;

  /**
   * méthode de chargement par défaut de vos contrôleurs Stimulus
   * lors d'un import
   * @default "eager"
   */
  fetchMode: "eager" | "lazy";

  /**
   * choisissez la méthode de résolution par défaut des identifiants des
   * contrôleurs Stimulus à partir du chemin du fichier
   * "snakeCase": "./assets/controllers/welcome_controller.js" -> "welcome"
   * "camelCase": "./assets/controllers/WelcomeController.js" -> "welcome"
   * @default "snakeCase"
   * si vous fournissez une fonction elle sera appelée avec comme premier
   * argument le chemin relative à la racine du projet et vous devrez retourner
   * une chaîne de caractère correspondant à l'identifiant du contrôleur.
   */
  identifierResolutionMethod: "snakeCase" | "camelCase" | ((path: string) => string);
}
```

:::warning
Par défaut le HMR est activé sur vos contrôleurs Stimulus. Si ces derniers ne sont pas idempotents (voir [doc Stimulus](https://turbo.hotwired.dev/handbook/building#making-transformations-idempotent)), vous risquez de rencontrez des problèmes (les HMR ne fonctionnera pas comme attendu et vous devrez rafraîchir manuellement votre page). Dans ce cas il est préférable de désactiver l'option `hmr: false`. Ainsi, toute modification du fichier entrainera quand même un rafraichissement automatique de la page.
:::

## `import.meta`

Le plugin `vite-plugin-symfony` introduit des `import.meta.stimulusXXX` pour configurer vos contrôleurs Stimulus.

```js
// ./assets/controllers/welcome_controller.js
import { Controller } from "@hotwired/stimulus";

import.meta.stimulusEnabled = true;
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

Ces méta-données sont analysées si vous réalisez un import de votre contrôleur avec le suffixe `?stimulus`.

```js
import WelcomeController from "./controllers/welcome_controller.js?stimulus";

console.log(WelcomeController);
/*
{
  identifier: "welcome",
  enabled: true,
  fetch: "eager",
  controller: WelcomeController
}
*/
```

### `import.meta.stimulusEnabled`

- **Type :** `boolean`
- **Valeur par défaut :** `true`

permet de désactiver temporairement votre contrôleur sans nécessiter de déplacer le fichier hors du dossier `controllers`.

### `import.meta.stimulusFetch`

- **Type :** `"eager" | "lazy"`
- **Valeur par défaut :** `"eager"`

définissez la manière dont votre contrôleur se chargera. Avec la valeur `lazy`, votre contrôleur sera
construit dans un fichier séparé qui ne sera chargé que lorsqu'un élément du DOM de la page fera explicitement référence à celui-ci.

### `import.meta.stimulusIdentifier`

- **Type :** `string`
- **Valeur par défaut :** génère l'identifier à partir du chemin du fichier.


définissez explicitement l'identifiant de votre contrôleur sinon il sera déduit à partir du nom du fichier.

| Path                                                                                                        | Identifier      |
|-------------------------------------------------------------------------------------------------------------|-----------------|
| `./controllers/welcome.js`                                                                                  | `welcome`       |
| `./controllers/welcome_controller.js` ignore the `_controller` suffix                                       | `welcome`       |
| `./library/welcome_controller.js` if `controllers` is absent compute from the project directory.            | `library--welcome` |
| `./before/controllers/welcome_controller.js` directories before `controllers` are ignored                   | `welcome`       |
| `./controllers/welcome_back_controller.js` the underscore is replaced by the middle dash                    | `welcome-back`  |
| `./what-you-want/MyController.js` with `import.meta.stimulusIdentifier = "welcome";`              | `welcome`       |


## Chargement des contrôleurs

Il est possible de charger vos contrôleurs de multiples manières. Le plugin met à disposition 4 fonctions.

```js
import {
  startStimulusApp,
  registerController,
  registerControllers,
  createLazyController,
} from "vite-plugin-symfony/stimulus/helpers";
```

Faisons un tour de chaque fonction afin de découvrir les avantages/inconvénients.


### `startStimulusApp`

```js
import { startStimulusApp } from "vite-plugin-symfony/stimulus/helpers";
const app = startStimulusApp();
```

Cette fonction va créer une application Stimulus et préchargera tous les contrôleurs que vous
avez définis dans le fichier `./assets/controllers.json`.

En général, dès que vous ajoutez un composant de Symfony UX, ses contrôleurs seront ajoutés dans
ce fichier.

C'est également le bon endroit pour ajouter des contrôleurs issus de [composants tiers](https://www.stimulus-components.com/).

```json
{
    "controllers": {
        // nom du package
        "@stimulus-components/color-picker": {

            // suffixe du contrôleur
            // l'identifiant sera donc "nom-du-package/suffix" avec des "-"
            // ex: stimulus-components--color-picker--picker
            "picker": {
                "enabled": true,
                "fetch": "lazy", // "eager" ou "lazy"

                // si vous trouvez que le nom du contrôleur est beaucoup trop long
                // vous pouvez le surcharger et définir ici un identifiant beaucoup plus court.
                "name": "color-picker",

                // si vous souhaiter inclure des fichiers supplémentaires
                "autoimport": {
                    "@simonwep/pickr/dist/themes/classic.min.css": true
                },

                // si votre contrôleur correspond à un fichier spécifique du package vous pouvez
                // définir explicitement son chemin ici.
                // sinon le chemin sera déduit de l'entrée "module" ou "main" du package.json.
                "main": "dist/stimulus-color-picker.mjs"
            }
        }
    },
    "entrypoints": []
}
```

### `registerController`

Si vous avez définis vos propres contrôleurs, cette fonction sera appropriée pour ajouter un contrôleur.

```js
import { startStimulusApp, registerController } from "vite-plugin-symfony/stimulus/helpers";

// pensez à ajouter le suffixe "?stimulus"
import ColorPicker from "./controllers/color_picker_controller?stimulus";

const app = startStimulusApp();

registerController(app, ColorPicker);
```

Les méta-données seront récupérées de vos `import.meta`. Si elles sont absentes, `fetch` sera à `"eager"` et l'identifiant sera déduit du nom de votre fichier (voir la [méthode de déduction](#import-meta-stimuluscontrolleridentifier)).

```js
// ./assets/controllers/color_picker_controller.js
import { Controller } from "@hotwired/stimulus";

import.meta.stimulusEnabled = true;
import.meta.stimulusFetch = "eager";
import.meta.stimulusIdentifier = "color-picker";

export default class controller extends Controller {
  // ...
}
```

### `registerControllers`

Si vous avez définis tous vos contrôleurs dans un même dossier, cette fonction sera appropriée pour les ajouter tous en une seule fois.

```js
import { startStimulusApp, registerControllers } from "vite-plugin-symfony/stimulus/helpers";

registerControllers(
  app,
  import.meta.glob(
    "./controllers/*_controller.js",
    {
      // pensez à ajouter le suffixe "?stimulus"
      query: "?stimulus",

      // les imports dynamiques et les `Lazy-`contrôleurs sont gérés en interne, dans tous les
      // cas il faut spécifier eager à true pour éviter des imbrications de promesses.
      eager: true,
    },
  ),
);
```

Comme avec `registerController` vous pouvez spécifier des `import.meta` dans chacun de vos fichiers
pour affiner la configuration de vos contrôleurs.

Utilisez la chaîne `./controllers/*_controller.js` que vous voulez pour configurer au mieux votre import.

Si vous n'utilisez pas `import.meta.stimulusIdentifier`, faites attention car le nom de vos
contrôleurs dépendra directement de l'emplacement de votre fichier.

Si votre dossier contient uniquement des contrôleurs, vous pourriez très bien spécifier `./controllers/*.js`.

::: warning
Vous ne pouvez pas utiliser de variable avec `import.meta.glob`. Voir la documentation de Vite pour vos [glob](https://vitejs.dev/guide/features.html#glob-import).
:::


### À la main

Afin de vous aider à mieux comprendre le fonctionnement de ces fonctions voici le code équivalent.

#### `startStimulusApp`

```js
import { startStimulusApp } from "vite-plugin-symfony/stimulus/helpers";
const app = startStimulusApp();
```

Équivalent:
```js
import { Application } from "@hotwired/stimulus";
const app = Application.start();

/**
 * l'import virtuel transforme votre fichier controllers.json en javascript
 * équivalent à
 * const thirdPartyControllers = [
 *    {
 *        identifier: "welcome",
 *        enabled: true,
 *        fetch: "eager",
 *        controller: WelcomeController
 *    }
 * ]
 */
import thirdPartyControllers from "virtual:symfony/controllers.json";
import { createLazyController } from "vite-plugin-symfony/stimulus/helpers";

for (const controllerInfos of thirdPartyControllers) {
  if (controllerInfos.fetch === "lazy") {
    app.register(controllerInfos.identifier, createLazyController(controllerInfos.controller));
  } else {
    app.register(controllerInfos.identifier, controllerInfos.controller);
  }
}
```

#### `registerController`


```js
import { registerController } from "vite-plugin-symfony/stimulus/helpers";

import ColorPicker from "./controllers/color_picker_controller?stimulus";
registerController(app, ColorPicker);
```
Équivalent (pseudo-code)
```js
import { createLazyController } from "vite-plugin-symfony/stimulus/helpers";

// si vous souhaitez un comportement eager
import ColorPickerController from "./controllers/color_picker_controller";
app.register("color-picker", ColorPickerController)

// si vous souhaitez un comportement lazy
app.register(
  "color-picker",
  createLazyController(() => import("./controllers/color_picker_controller")),
);
```

## TypeScript

Si vous utilisez TypeScript dans votre projet, voici quelques conseils pour
faciliter votre développement.

Ajoutez dans un fichier d'environnement la ligne de référence ci-dessous.
Cela permettra à votre IDE de typer les `import.meta.stimulusXXX` et les imports de type `*?stimulus`.

```ts
// ./assets/env.d.ts

/// <reference types="vite-plugin-symfony/stimulus/env" />
```

Enfin vous pouvez spécifier le type de retour de vos `import.meta.glob` avec `StimulusControllerInfosImport`.

```ts
// ./assets/bootstrap.ts
import { registerControllers } from "vite-plugin-symfony/stimulus/helpers";

registerControllers(
  app,
  import.meta.glob<StimulusControllerInfosImport>(
    "./controllers/*_controller.ts",
    {
      query: "?stimulus",
      eager: true,
    },
  ),
);
```
