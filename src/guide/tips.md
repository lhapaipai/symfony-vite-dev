
# Usage tips

If you want to install the bundle without the community recipe, check the [manual installation](/extra/manual-installation.html).

## CSS files as entrypoint

This section talk about FOUC (Flash of unstyled content) for development only. Normally this phenomenon should not occur after a build process.

By default if you import your css files from js entry point, the vite dev server create only one entrypoint (`<script src="http://localhost:5173/build/assets/app.js" type="module"></script>`) for your js and css files. Your css content will be loaded after. This result to a period of time when the content of the page will not be styled. It can be boring.

You can however provide a css/scss/... file as entrypoint and it will be directly inserted as a link tag `<link rel="stylesheet" href="http://localhost:5173/build/assets/theme.scss">`.
In this way your browser will wait for the loading of your `theme.scss` file before rendering the page.

```js
export default defineConfig({
    // ...your config
    build: {
        rollupOptions: {
            input: {
                theme: "./assets/theme.scss"
            },
        }
    },
});
```

::: tip
still add the 2 twig functions vite_entry_link_tags / vite_entry_script_tags
even if the entry point is a css file because in development mode Vite will need to insert its js code to activate the HMR.
:::

```twig
{% block stylesheets %}
    {{ vite_entry_link_tags('theme') }}
{% endblock %}

{% block javascripts %}
    {{ vite_entry_script_tags('theme') }}
{% endblock %}
```

will render
```html
<script src="http://localhost:5173/build/@vite/client" type="module">
<link rel="stylesheet" href="http://localhost:5173/build/assets/theme.scss">
```
during development.

## Dependency Pre-Bundling

Initially in a Vite project, `index.html` is the entry point to your application. When you run your dev serve, Vite will crawl your source code and automatically discover dependency imports.

Because we don't have any `index.html`, Vite can't do this Pre-bundling step when he starts but when you browse a page where he finds a package he does not already have cached. Vite will re-run the dep bundling process and reload the page.

this behavior can be annoying if you have a lot of dependencies because it creates a lot of page reloads before getting to the final render.

you can limit this by declaring in the `vite.config.js` the most common dependencies of your project.

```js
// vite.config.js

export default defineConfig({
    server: {
        //Set to true to force dependency pre-bundling.
        force: true,
    },
    // ...
    optimizeDeps: {
        include: ["my-package"],
    },
});
```
## One file by entry point

Vite try to split your js files into multiple smaller files shared between entry points. In some cases, it's not a good choise and you can prefer output one js file by entry point.

```js
// vite.config.js

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
```

## https / http in Development

Your Vite dev server can cause unwanted reload if used in http and your Symfony application uses https (probably due to invalid certificates ). Configuration is easier if you develop your application without https.

```bash
npm run dev
symfony serve --no-tls
```

browse : `http://127.0.0.1:8000`

if you still want to use https you will need to generate certificates for your Vite dev server.

you can use mkcert : https://github.com/FiloSottile/mkcert

```bash
mkcert -install
mkcert -key-file certs/vite.key.pem -cert-file certs/vite.crt.pem localhost 127.0.0.1

```

```js
// vite.config.js
import fs from "fs";

export default defineConfig({

    // ...
    server: {
        https: {
          key: fs.readFileSync('certs/vite.key.pem'),
          cert: fs.readFileSync('certs/vite.crt.pem'),
        },
        cors: true
    },
});
```

```bash
npm run dev
symfony serve
```

browse : `https://127.0.0.1:8000`

## Dependency injection

if you want more control (like creating custom Twig functions),
you can use dependency injection with EntrypointRenderer / EntrypointsLookup.

```php
use Twig\Extension\AbstractExtension;
use Pentatrion\ViteBundle\Asset\EntrypointRenderer;
use Pentatrion\ViteBundle\Asset\EntrypointsLookup;

class YourTwigExtension extends AbstractExtension
{
    public function __contruct(
        private EntrypointsLookup $entrypointsLookup,
        private EntrypointRenderer $entrypointsRenderer
    ) {
        // ...
    }
}
```

