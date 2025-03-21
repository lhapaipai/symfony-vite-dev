# Stimulus <img src="/images/logo-stimulus.svg" width="24" height="24" style="display: inline;" />

## Installation

Stimulus is a lightweight JavaScript framework that aims to facilitate the integration of JavaScript components into a project. It connects JavaScript objects called `controllers` to HTML elements on a page via `data-*` attributes.



```bash
composer require symfony/stimulus-bundle

# remove the webpack-compatible @symfony/stimulus-bridge
npm rm @symfony/stimulus-bridge
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
  plugins: [
    symfonyPlugin({
      // a boolean to activate stimulus with default options
      stimulus: true // [!code ++]

      // or specify the path to your controllers.json
      stimulus: './assets/other-dir/controllers.json' // [!code ++]

      // or specify a configuration object [!code ++]
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

If you want to see all available options, see the [reference](/stimulus/reference) section

If you are using TypeScript. Add these type definitions for the `import.meta.stimulusXXX` and `*?stimulus` type imports in an `env.d.ts` file.

```ts
/// <reference types="vite-plugin-symfony/stimulus/env" />
```

If you ran the Flex recipe the import has probably already been added.

```js
// assets/app.js
import './bootstrap.js';
```

Add the stimulus application generation routines compatible with `symfony/stimulus-bundle` and `vite`.

:::code-group
```js [assets/bootstrap.js]
import { startStimulusApp, registerControllers } from "vite-plugin-symfony/stimulus/helpers";

const app = startStimulusApp();
registerControllers(
  app,
  import.meta.glob('./controllers/*_controller.js', {
    query: "?stimulus",
    /**
     * always true, the `lazy` behavior is managed internally with
     * import.meta.stimulusFetch (see reference)
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
       * always true, the `lazy` behavior is managed internally with
       * import.meta.stimulusFetch (see reference)
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
Please note that for HMR to work properly, your initialization file (the file that calls the `startStimulusApp` function) must be named `bootstrap.js` or `bootstrap.ts`. If you named your file something else, you will need to manually add these few lines.

```diff
// assets/stimulus.js
import { startStimulusApp } from "vite-plugin-symfony/stimulus/helpers";
const app = startStimulusApp();

// some logic

+ if (import.meta.hot) {
+   window.$$stimulusApp$$ = stimulusApp;
+ }
```
:::

## Examples

The development repository [lhapaipai/symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) contains a folder `playground/stimulus-basic` and another `playground/stimulus` containing a complete implementation of Stimulus with Symfony UX.


```bash
git clone https://github.com/lhapaipai/symfony-vite-dev.git
cd symfony-vite-dev

# install vite-bundle dependencies
# build vite-plugin-symfony
make install

cd playground/stimulus-basic
# or for Symfony UX
cd playground/stimulus

composer install
symfony serve
pnpm dev
```
