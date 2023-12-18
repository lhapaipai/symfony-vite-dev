
# Symfony UX

| UX packages       | Compatibility | UX packages       | Compatibility |
|-------------------|---------------|-------------------|---------------|
| ux-autocomplete   | ✅            | ux-svelte         | ✅ (*)        |
| ux-chartjs        | ✅            | ux-swup           | ✅            |
| ux-cropperjs      | ✅            | ux-toggle         | ✅            |
| ux-dropzone       | ✅            | ux-translator     | ✅            |
| ux-lazy           | ✅            | ux-turbo          | 🤯 Not Tested    |
| ux-live-component | ✅            | ux-twig           | ✅            |
| ux-notify         | 🤯 Not Tested    | ux-typed          | ✅            |
| ux-react          | ✅ (*)        | ux-vue            | ✅ (*)        |

(*) requires some code changes

## Prerequisites

```bash
composer require symfony/stimulus-bundle

# remove the webpack-compatible @symfony/stimulus-bridge
npm rm @symfony/stimulus-bridge
```

## symfony/ux-vue

Basic installation

```bash
composer require symfony/ux-vue
npm i --force
```

After installing the Flex recipe from `symfony/ux-vue` you will need to correct these lines.

```js
// assets/bootstrap.js
import { registerVueControllerComponents } from '@symfony/ux-vue'; // [!code --]
registerVueControllerComponents(require.context('./vue/controllers', true, /\.vue$/)); // [!code --]

import { startStimulusApp, registerControllers } from "vite-plugin-symfony/stimulus/helpers" // [!code ++]
import { registerVueControllerComponents } from "vite-plugin-symfony/stimulus/helpers/vue" // [!code ++]
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
```twig
{# your-template.html.twig #}
<div {{ vue_component('Hello', { 'name': 'Vite & Stimulus' }) }}></div>
```
```vue
<!-- assets/vue/controllers/Hello.vue -->
<template>
    <div>Hello {{ name }}!</div>
</template>

<script setup>
    defineProps({
        name: String
    });
</script>
```

Documentation : [Symfony doc](https://symfony.com/bundles/ux-vue/current/index.html), [Symfony UX](https://ux.symfony.com/vue).


## symfony/ux-react

Basic installation

```bash
composer require symfony/ux-react
npm i --force
```

After installing the Flex recipe from `symfony/ux-react` you will need to correct these lines.

```js
// assets/bootstrap.js
import { registerReactControllerComponents } from '@symfony/ux-react'; // [!code --]
registerReactControllerComponents(require.context('./react/controllers', true, /\.(j|t)sx?$/)); // [!code --]

import { startStimulusApp, registerControllers } from "vite-plugin-symfony/stimulus/helpers" // [!code ++]
import { registerReactControllerComponents } from "vite-plugin-symfony/stimulus/helpers/react" // [!code ++]
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
{# base.html.twig #}
{{ vite_entry_link_tags('app') }}
{{ vite_entry_script_tags('app', {
    dependency: 'react' // [!code ++]
  }) }}
```
```twig
{# your-template.html.twig #}
<div {{ react_component('Hello', { 'fullName': 'Vite & Stimulus' }) }}></div>
```
```jsx
// assets/react/controllers/Hello.jsx
import React from 'react';

export default function (props) {
    return <div>Hello {props.fullName}</div>;
}
```

Documentation : [Symfony doc](https://symfony.com/bundles/ux-react/current/index.html), [Symfony UX React](https://ux.symfony.com/react).


## symfony/ux-svelte

Basic installation

```bash
composer require symfony/ux-svelte
npm i --force
```

After installing the Flex recipe from `symfony/ux-svelte` you will need to correct these lines.

```js
// assets/bootstrap.js
import { registerSvelteControllerComponents } from '@symfony/ux-svelte'; // [!code --]
registerSvelteControllerComponents(require.context('./svelte/controllers', true, /\.svelte$/)); // [!code --]

import { startStimulusApp, registerControllers } from "vite-plugin-symfony/stimulus/helpers" // [!code ++]
import { registerSvelteControllerComponents } from "vite-plugin-symfony/stimulus/helpers/svelte" // [!code ++]
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
```twig
{# your-template.html.twig #}
<div {{ svelte_component('Hello', { 'name': 'Vite & Stimulus' }) }}></div>
```
```svelte
<!-- assets/svelte/controllers/Hello.svelte -->
<script>
    export let name = "Svelte";
</script>

<div>Hello {name}</div>
```
Documentation : [Symfony doc](https://symfony.com/bundles/ux-svelte/current/index.html), [Symfony UX Svelte](https://ux.symfony.com/svelte).
