
# Usage tips 💡

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
still add the two Twig functions vite_entry_link_tags / vite_entry_script_tags
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

## Docker <img src="/images/logo-docker.svg" width="34" height="24" style="display: inline;" />

If you are using Docker for your Symfony development and running your node commands in a container, you will need to make some configuration adjustments.

Let's take the example with an image `node:21-alpine`.

```bash
docker run
  --rm \
  -ti \
  --user $(id -u):$(id -g) \
  -v $(pwd):/app \
  -p 5173:5173 \
  -w /app \
  node:21-alpine \
  npm run dev
```


```js
// vite.config.js
export default defineConfig({
    server: {
        // nous avons besoin que vite écoute sur toutes les interfaces
        host: '0.0.0.0'
    },
    plugins: [
        symfonyPlugin({
            // comme nous avons spécifié un `server.host` = 0.0.0.
            // nous devons explicitement nommer le server host name
            // à utiliser.
            viteDevServerHostname: 'localhost'
        }),
    ],
    build: {
        rollupOptions: {
            input: {
                app: "./assets/app.js"
            },
        }
    },
});
```

An example configuration with Docker can be found in the [Symfony Vite Dev sandboxes](https://github.com/lhapaipai/symfony-vite-dev/tree/main/playground).

You can learn more by following this [Github discussion](https://github.com/lhapaipai/vite-bundle/issues/26).



## Dependency Pre-Bundling 🏃

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
## Configure splitting files per entry point 📦

Vite tries to split your js files into multiple smaller files shared between entry points.
To configure the exact splitting one can define a `manualChunks` function in `rollupOptions`, refer to [rollup docs on manual chunks](https://rollupjs.org/configuration-options/#output-manualchunks) for more details.

```js
// vite.config.js

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string, {getModuleInfo, getModuleIds}) => {
          // your code
        },
      },
    },
  },
});
```

## https / http in Development 🔒

Your Vite dev server can cause unwanted reload (and mixed content warnings) if used in http and your Symfony application uses https (probably due to invalid certificates). Configuration is easier if you develop your application without https.

```bash
npm run dev
symfony serve --no-tls
```

browse : `http://127.0.0.1:8000`

If you still want to use https, you can use one of the two options below.

### Use symfony cli certificate

First, [enable symfony-cli TLS](https://symfony.com/doc/current/setup/symfony_server.html#enabling-tls) if you haven't done it yet.

```js
// vite.config.js
import fs from "fs";
import { join } from 'node:path';
import { homedir } from 'node:os';

export default defineConfig({
    // ...
    server: {
        https: {
            pfx: join(homedir(), '.symfony5/certs/default.p12'),
        },
        cors: true
    },
});
```

::: tip
If you get TLS related errors when launching the dev server, this might be caused by an old symfony-cli version/node <17 version combination.
To fix this, you can either:
 - prepend `NODE_OPTIONS=--openssl-legacy-provider` to your `dev` npm script
 - delete your current certificate and restart your server ([full details here](https://github.com/symfony/symfony-docs/pull/19369))
:::

### Generate custom certificates

With [mkcert](https://github.com/FiloSottile/mkcert)

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
