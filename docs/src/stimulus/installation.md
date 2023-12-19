# Stimulus <img src="/images/logo-stimulus.svg" width="24" height="24" style="display: inline;" />

## Installation

::: warning
🧪 Please note that Stimulus implementation is marked unstable and may be subject to breaking changes without a major release. The code is fully functional, some implementations with Symfony UX are not finished (see compatibility table at the bottom of the page) and some function names may change.
:::

Stimulus is a lightweight JavaScript framework that aims to facilitate the integration of JavaScript components into a project. It connects JavaScript objects called `controllers` to HTML elements on a page via `data-*` attributes.

```mermaid
flowchart TB
  style virtual stroke-dasharray: 5 5;
  style groupReact fill:#fffac7;
  style groupUX fill:#fbfbfb, stroke-dasharray: 5 5;
  style groupCustom fill:#fbfbfb, stroke-dasharray: 5 5;
  classDef file fill:#fcf9d7, stroke:#dba726;
  classDef package fill:#fff155, stroke:#dba726;
  classDef virtualPackage fill:#fff155, stroke:#dba726, stroke-dasharray: 5 5;
  classDef directory stroke:#dba726, fill:#f2f2f2, stroke-dasharray: 5 5;
  classDef rawFile stroke:#dba726, fill:#f2f2f2, stroke-dasharray: 2 2;

  bootstrap(bootstrap.js):::file
  app(app.js):::file


  subgraph groupCustom[Custom controllers]
    customControllers>"./controllers/\*"]:::directory
    welcome_controller(welcome_controller.js):::file
    slideshow_controller(slideshow_controller.js):::file
  end

  subgraph groupUX[Stimulus Bundle with Symfony UX]
    virtual(virtual:symfony/controllers):::virtualPackage

    uxReact(symfony/ux-react):::package
    uxChartjs(symfony/ux-chartjs):::package
    uxDropzone(symfony/ux-dropzone):::package

    controllers{{controllers.json}}:::rawFile

    subgraph groupReact[React]

    reactComponents>./react/controllers/\*]:::directory
    counter(counter.jsx):::file
    card(Card.jsx):::file
    end
  end

  app -->|import| bootstrap

  %% bootstrap(bootstrap.js):::file -->|"registerReactControllerComponents()"| reactComponents>./react/controllers/\*]



  bootstrap --->|"startStimulusApp()"| virtual
  bootstrap -->|"registerControllers()"| customControllers

  customControllers ---> welcome_controller & slideshow_controller

  virtual --> uxReact & uxChartjs & uxDropzone

  controllers -->|transformed into| virtual
  uxReact --> reactComponents
  reactComponents --> counter & card

```

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

import { startStimulusApp, registerControllers } from "vite-plugin-symfony/stimulus/helpers"
const app = startStimulusApp();
registerControllers(
  app,
  import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?')
)
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

## Examples

The development repository [lhapaipai/symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) contains a `playground/stimulus` directory containing a complete implementation of Stimulus with Symfony UX.

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
