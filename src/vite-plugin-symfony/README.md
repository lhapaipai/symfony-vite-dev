<div>
  <p align="center">
  <img width="100" src="https://raw.githubusercontent.com/lhapaipai/vite-bundle/main/docs/symfony-vite.svg" alt="Symfony logo">
  </p>
  <p align="center">
    <img src="https://img.shields.io/npm/v/vite-plugin-symfony?style=flat-square&logo=npm">
    <img src="https://img.shields.io/github/actions/workflow/status/lhapaipai/symfony-vite-dev/vite-plugin-symfony-ci.yml?style=flat-square&label=vite-plugin-symfony%20CI&logo=github">
  </p>
</div>


# Vite plugin Symfony

> [!IMPORTANT]
> This repository is a "subtree split": a read-only subset of that main repository [symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) which delivers to packagist only the necessary code.

> [!IMPORTANT]
> If you want to open issues, contribute, make PRs or consult examples you will have to go to the [symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) repository.

A Vite plugin to easily integrate Vite into your Symfony application.

- create a `entrypoints.json` file inside your build directory with your js/css/preload dependencies.
- reload your browser when you update your twig files

This package is intended for use with the Symfony Bundle : [pentatrion/vite-bundle](https://github.com/lhapaipai/vite-bundle).


## Installation

```console
npm i vite-plugin-symfony
```

Create this directory structure :
```
├──assets
│ ├──app.js
│ ├──app.css
│...
├──public
├──composer.json
├──package.json
├──vite.config.js
```

Vite base config with vite

```js
// vite.config.js
import {defineConfig} from "vite";
import symfonyPlugin from "vite-plugin-symfony";

export default defineConfig({
    plugins: [
        symfonyPlugin(/* options */),
    ],

    build: {
        rollupOptions: {
            input: {
              app: "./assets/app.js" /* relative to the root option */
            },
        },
    }
});
```

and your package.json :
```json
{
    "scripts": {
        "dev": "vite",
        "build": "vite build"
    },
    "devDependencies": {
        "vite": "^5.0",
        "vite-plugin-symfony": "^8.2"
    }
}
```

[Read the Docs to Learn More](https://symfony-vite.pentatrion.com).

## Ecosystem

| Package                                                                 | Description               |
| ----------------------------------------------------------------------- | :------------------------ |
| [vite-bundle](https://github.com/lhapaipai/vite-bundle)                 | Symfony Bundle (read-only)|
| [symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev)       | Package for contributors  |

## License

[MIT](LICENSE).
