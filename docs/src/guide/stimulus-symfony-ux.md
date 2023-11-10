# Stimulus

## Introduction

Stimulus is a lightweight JavaScript framework that aims to facilitate the integration of JavaScript components into a project. It connects JavaScript objects called `controllers` to HTML elements on a page via `data-*` attributes.

## Installation

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

      // or define custom path for your controllers.json
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

If you have run the Flex recipe the import has certainly already been added.

```js
// assets/app.js
import './bootstrap.js';
```

Add the routines for generating a stimulus application compatible with `symfony/stimulus-bundle` and `vite`.

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
{# in some template #}
<h1 {{ stimulus_controller('hello') }}></h1>
```


## Explanations

In order to facilitate the integration of Stimulus into Symfony applications, the latter has created a specific bundle `symfony/stimulus-bundle`. This bundle adds:

- Twig functions and filters to easily generate `data-*` attributes
- services to create Stimulus compatible `data-*` attributes and use them in your own services.
- a system for automatic and lazy loading of Stimulus controllers via an npm package `@symfony/stimulus-bridge` linked to the bundle. The latter will analyze
   - the `assets/controllers.json` file for your third-party controllers
   - controllers stored in an `assets/controllers` folder
and will return code for the Stimulus app to automatically preload.


On top of that Symfony has built an entire `Symfony UX` eco-system based on bundles which each integrate `Stimulus` controllers.


The npm package `@symfony/stimulus-bridge` is not compatible with Vite:
   - usage of `require.context`
   - usage of `webpack` loaders

the `vite-plugin-symfony` plugin replaces `@symfony/stimulus-bridge` and provides the bridge between `symfony/stimulus-bundle`, `Symfony UX` and `Vite`.

## Differences with the original implementation.

If you want to define your own controllers with lazy loading.

```js
// assets/controllers/welcome_controller.js
import { Controller } from '@hotwired/stimulus';

// IS NOT COMPATIBLE !
/* stimulusFetch: 'lazy' */ // [!code --]
export default class extends Controller {
    // ...
}
```

Instead, suffix the name of your controller with `_lazycontroller.js`:

```js
// assets/controllers/welcome_lazycontroller.js // [!code ++]
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    // ...
}
```

### Third-party controllers

The webpack loader from `@symfony/stimulus-bridge` cannot be used.

```js
// IS NOT COMPATIBLE !
import Clipboard from '@symfony/stimulus-bridge/lazy-controller-loader?lazy=true!stimulus-clipboard'; // [!code --]
const app = startStimulusApp(require.context(
    // ...
));

// usual way
app.register('clipboard', Clipboard);
```

Chargez plutôt ces contrôleurs avec le fichier `controllers.json`

```json
{
    "controllers": {
        "stimulus-clipboard": {     // npm package name
            "stimulus-clipboard": { // controller id

                // to prevent collisions symfony generate a
                // controller name : <package-name>--<controller-name>
                // define here your custom name if you want to use simpler name
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
| ux-react                       | Wip           |
| ux-svelte                      | Wip           |
| ux-swup                        | ✅            |
| ux-toggle                      | ✅            |
| ux-translator                  | ✅            |
| ux-turbo (not tested)          | NOT Tested    |
| ux-twig                        | ✅            |
| ux-typed                       | ✅            |
| ux-vue                         | ✅ (*)        |

(*) requires some code changes

### symfony/ux-vue

After installing the Flex recipe from `symfony/ux-vue` you will need to correct these lines.

```js
// assets/bootstrap.js
import { startStimulusApp } from "vite-plugin-symfony/stimulus/helpers"

import { registerVueControllerComponents } from '@symfony/ux-vue'; // [!code --]
import { registerVueControllerComponents } from "vite-plugin-symfony/stimulus/helpers" // [!code ++]

registerVueControllerComponents(require.context('./vue/controllers', true, /\.vue$/)); // [!code --]
registerVueControllerComponents(import.meta.glob('./vue/controllers/**/*.vue')) // [!code ++]

const app = startStimulusApp(import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?'));
