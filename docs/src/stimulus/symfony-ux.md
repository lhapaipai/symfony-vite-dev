
# Symfony UX

| UX packages                    | Compatibility |
|--------------------------------|---------------|
| ux-autocomplete                | ✅            |
| ux-chartjs                     | ✅            |
| ux-cropperjs                   | ✅            |
| ux-dropzone                    | ✅            |
| ux-lazy                        | ✅            |
| ux-live-component              | Not Tested    |
| ux-notify                      | Not Tested    |
| ux-react                       | ✅ (*)        |
| ux-svelte                      | ✅ (*)        |
| ux-swup                        | ✅            |
| ux-toggle                      | ✅            |
| ux-translator                  | ✅            |
| ux-turbo                       | Not Tested    |
| ux-twig                        | ✅            |
| ux-typed                       | ✅            |
| ux-vue                         | ✅ (*)        |

(*) requires some code changes

### symfony/ux-vue

Basic installation

```bash
composer require symfony/ux-vue
npm i --force
```

After installing the Flex recipe from `symfony/ux-vue` you will need to correct these lines.

```js
// assets/bootstrap.js
import { startStimulusApp } from "vite-plugin-symfony/stimulus/helpers"

import { registerVueControllerComponents } from '@symfony/ux-vue'; // [!code --]
import { registerVueControllerComponents } from "vite-plugin-symfony/stimulus/helpers" // [!code ++]

registerVueControllerComponents(require.context('./vue/controllers', true, /\.vue$/)); // [!code --]

// register Vue components before startStimulusApp
registerVueControllerComponents(import.meta.glob('./vue/controllers/**/*.vue')) // [!code ++]

const app = startStimulusApp();
registerControllers(app, import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?'))
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
      stimulus: true // [!code ++]
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

Documentation : [Symfony doc](https://symfony.com/bundles/ux-vue/current/index.html), [Symfony UX](https://ux.symfony.com/vue).


### symfony/ux-react

Basic installation

```bash
composer require symfony/ux-react
npm i --force
```

After installing the Flex recipe from `symfony/ux-react` you will need to correct these lines.

```js
// assets/bootstrap.js
import { startStimulusApp } from "vite-plugin-symfony/stimulus/helpers"

import { registerReactControllerComponents } from '@symfony/ux-react'; // [!code --]
import { registerReactControllerComponents } from "vite-plugin-symfony/stimulus/helpers" // [!code ++]

registerReactControllerComponents(require.context('./react/controllers', true, /\.(j|t)sx?$/)); // [!code --]
registerReactControllerComponents(import.meta.glob('./react/controllers/**/*.[jt]s(x)\?')); // [!code ++]


const app = startStimulusApp();
registerControllers(app, import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?'))
```

Because `import.meta.glob` create already `lazy` imports, you need to set fetch `eager` (otherwise your component will become **really too lazy**).
```json
{
    "controllers": {
        "@symfony/ux-react": {
            "react": {
                "enabled": true,
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
      stimulus: true // [!code ++]
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

Basic installation

```bash
composer require symfony/ux-svelte
npm i --force
```

After installing the Flex recipe from `symfony/ux-svelte` you will need to correct these lines.

```js
// assets/bootstrap.js
import { startStimulusApp } from "vite-plugin-symfony/stimulus/helpers"

import { registerSvelteControllerComponents } from '@symfony/ux-svelte'; // [!code --]
import { registerSvelteControllerComponents } from "vite-plugin-symfony/stimulus/helpers" // [!code ++]

registerSvelteControllerComponents(require.context('./svelte/controllers', true, /\.svelte$/)); // [!code --]
registerSvelteControllerComponents(import.meta.glob('./svelte/controllers/**/*.svelte')); // [!code ++]


const app = startStimulusApp();
registerControllers(app, import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?'))
```

Because `import.meta.glob` create already `lazy` imports, you need to set fetch `eager` (otherwise your component will become **really too lazy**).
```json
{
    "controllers": {
        "@symfony/ux-svelte": {
            "svelte": {
                "enabled": true,
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
