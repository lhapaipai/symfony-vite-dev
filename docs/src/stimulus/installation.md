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
      stimulus: true // [!code ++]

      // or specify the path to your controllers.json
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
import { registerControllers } from "vite-plugin-symfony/stimulus/helpers";

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

## Examples

The development repository [lhapaipai/symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) contains a folder `playground/stimulus-basic` and another `playground/stimulus` containing a complete implementation of Stimulus with Symfony UX.


```bash
git clone https://github.com/lhapaipai/symfony-vite-dev.git
cd symfony-vite-dev
make install
cd playground/stimulus
composer install
npm i

symfony serve
npm run dev
```
