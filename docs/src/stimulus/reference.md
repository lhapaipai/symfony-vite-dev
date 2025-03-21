# Reference

## Stimulus configuration from Vite plugin

You can configure Stimulus from the `vite-plugin-symfony` plugin with the `stimulus` property.

```ts
// vite.config.js
import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";

export default defineConfig({
  plugins: [
    symfonyPlugin({
      // a boolean to activate stimulus with default options
      stimulus: true // [!code ++]

      // or specify the path to your controllers.json
      stimulus: './assets/other-dir/controllers.json' // [!code ++]

      stimulus: { // [!code ++]
        /* your options */ // [!code ++]
      } satisfies VitePluginSymfonyStimulusOptions, // [!code ++]
    }),
  ],
  // ...
});
```


```ts
type VitePluginSymfonyStimulusOptions = {
  /**
   * path to the deepest folder that contains all your stimulus controllers
   * relative to vite root
   * @default "./assets/controllers"
   */
  controllersDir: string;

  /**
   * path to controllers.json relative to vite root
   * @default "./assets/controller.json"
   */
  controllersFilePath: string;

  /**
   * enable hmr for controllers
   * @default true
   */
  hmr: boolean;

  /**
   * default fetch mode when importing Stimulus Controller
   * @default "eager"
   */
  fetchMode: "eager" | "lazy";

  /**
   * choose the default method for resolving Stimulus controller identifier
   * from the file path
   * "snakeCase": "./assets/controllers/welcome_controller.js" -> "welcome"
   * "camelCase": "./assets/controllers/WelcomeController.js" -> "welcome"
   * @default "snakeCase"
   * if you provide a function, it will be called with the path relative
   * to the project root directory as its first argument and it should return an
   * identifier for your controller
   */
  identifierResolutionMethod: "snakeCase" | "camelCase" | ((path: string) => string);

}
```

:::warning
By default, HMR is activated on your Stimulus controllers. If these are not idempotent (see [Stimulus doc](https://turbo.hotwired.dev/handbook/building#making-transformations-idempotent)), you may encounter problems (HMRs will not work as expected and you will have to manually refresh your page). In this case it is preferable to deactivate the `hmr: false` option. Therefore, any modification of the file will still result in an automatic refresh of the page.
:::

## `import.meta`

The `vite-plugin-symfony` plugin introduces `import.meta.stimulusXXX` to configure your Stimulus controllers.

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

This metadata is parsed if you import your controller with the suffix `?stimulus`.

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
- **Default value:** `true`

allows you to temporarily disable your controller without having to move the file out of the `controllers` directory.

### `import.meta.stimulusFetch`

- **Type :** `"eager" | "lazy"`
- **Default value:** `"eager"`

set how your controller will load. With `lazy`, your controller will be
built in a separate file that will only be loaded when a element of the page's DOM will explicitly reference it.

### `import.meta.stimulusIdentifier`

- **Type :** `string`
- **Default value:** generate identifier from file path


Explicitly set your controller identifier or it will be inferred from the file name.

| Path                                                                                                        | Identifier      |
|-------------------------------------------------------------------------------------------------------------|-----------------|
| `./controllers/welcome.js`                                                                                  | `welcome`       |
| `./controllers/welcome_controller.js` ignore the `_controller` suffix                                       | `welcome`       |
| `./library/welcome_controller.js` if `controllers` is absent compute from the project directory.            | `library--welcome` |
| `./before/controllers/welcome_controller.js` directories before `controllers` are ignored                   | `welcome`       |
| `./controllers/welcome_back_controller.js` the underscore is replaced by the middle dash                    | `welcome-back`  |
| `./what-you-want/MyController.js` with `import.meta.stimulusIdentifier = "welcome";`              | `welcome`       |


## Registering your controllers

It is possible to load your controllers in multiple ways. The plugin provides 4 helper functions.

```js
import {
  startStimulusApp,
  registerController,
  registerControllers,
  createLazyController,
} from "vite-plugin-symfony/stimulus/helpers";
```

Let's take a look at each function to discover the advantages/disadvantages.

### `startStimulusApp`

```js
import { startStimulusApp } from "vite-plugin-symfony/stimulus/helpers";
const app = startStimulusApp();
```

This function will create a Stimulus application and preload all the controllers you
defined in the `./assets/controllers.json` file.

In general, whenever you add a Symfony UX component, its controllers will be added in
this file.

This is also the right place to add controllers from [third-party components](https://www.stimulus-components.com/).


```json
{
    "controllers": {
        // package name
        "@stimulus-components/color-picker": {

            // controller suffix
            // the identifier will therefore be "package-name/suffix" with "-"
            // ex: stimulus-components--color-picker--picker
            "picker": {
                "enabled": true,
                "fetch": "lazy", // "eager" ou "lazy"

                // if you find that the controller name is way too long
                // you can override it and set a much shorter identifier here.
                "name": "color-picker",

                // if you want to include additional files
                "autoimport": {
                    "@simonwep/pickr/dist/themes/classic.min.css": true
                },

                // if your controller corresponds to a specific file in the package you can
                // explicitly set its path here.
                // otherwise the path will be inferred from the "module" or "main" entry in package.json.
                "main": "dist/stimulus-color-picker.mjs"
            }
        }
    },
    "entrypoints": []
}
```

### `registerController`

If you have defined your own controllers, this function will be appropriate to add a controller.

```js
import { startStimulusApp, registerController } from "vite-plugin-symfony/stimulus/helpers";

// remember to add the suffix "?stimulus"
import ColorPicker from "./controllers/color_picker_controller?stimulus";

const app = startStimulusApp();

registerController(app, ColorPicker);
```

The meta data will be retrieved from your `import.meta`. If it is absent, `fetch` will be `"eager"` and the identifier will be deduced from your file name (see the [deduction method](#import-meta-stimuluscontrolleridentifier)).

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

If you have defined all your controllers in the same folder, this function will be appropriate to add them all at once.

```js
import { startStimulusApp, registerControllers } from "vite-plugin-symfony/stimulus/helpers";

registerControllers(
  app,
  import.meta.glob(
    "./controllers/*_controller.js",
    {
      // remember to add the suffix "?stimulus"
      query: "?stimulus",

      // dynamic imports and `Lazy-`controllers are managed internally, in all
      // cases you must specify eager to true to avoid nesting promises.
      eager: true,
    },
  ),
);
```

As with `registerController` you can specify `import.meta` in each of your files
to refine the configuration of your controllers.

Use the `./controllers/*_controller.js` string you want to best configure your import.

If you don't use `import.meta.stimulusIdentifier`, be careful because the name of your
controllers will directly depend on the location of your file.

If your directory only contains controllers, you could very well specify `./controllers/*.js`.

::: warning
You cannot use a variable with `import.meta.glob`. See the Vite documentation for your [glob](https://vitejs.dev/guide/features.html#glob-import).
:::


### Manually

To help you better understand how these functions work, here is the equivalent code.


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
 * virtual import transforms your controllers.json file into javascript
 * equivalent to
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

//  if you want eager behavior
import ColorPickerController from "./controllers/color_picker_controller";
app.register("color-picker", ColorPickerController)

//  if you want lazy behavior
app.register(
  "color-picker",
  createLazyController(() => import("./controllers/color_picker_controller")),
);
```

## TypeScript

If you are using TypeScript in your project, here are some tips to
facilitate your development.

Add the reference line below to an environment file.
This will allow your IDE to type `import.meta.stimulusXXX` and imports of type `*?stimulus`.

```ts
// ./assets/env.d.ts

/// <reference types="vite-plugin-symfony/stimulus/env" />
```

Finally you can specify the return type of your `import.meta.glob` with `StimulusControllerInfosImport`.

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
