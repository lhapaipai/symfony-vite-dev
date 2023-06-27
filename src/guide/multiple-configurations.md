
# Multiple Vite Configurations

It's possible to combine multiple Vite configuration files. Here is a possible configuration model.

`package.json`
```json
{
  "dependencies": {
    "concurrently": "^8",
  },
  "scripts": {
    "dev": "concurrently \"vite -c vite.build1.config.js\" \"vite -c vite.build2.config.js\"",
    "build": "vite build -c vite.build1.config.js && vite build -c vite.build2.config.js"
  }
}
```

## Vite configuration

define 2 vite config files `vite.build1.config.js` and `vite.build2.config.js`.

```js
// vite.build1.config.js
import { defineConfig } from 'vite'
import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
  plugins: [
    symfonyPlugin({
      buildDirectory: 'build-1'
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        "welcome": "./assets/page/welcome/index.js",
        "theme": "./assets/theme.scss"
      },
    },
  },

  server: {
    port: 19875
  },
});
```

```js
// vite.build2.config.js
import { defineConfig } from 'vite'
import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
  plugins: [
    symfonyPlugin({
      buildDirectory: 'build-2'
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        "multiple": "./assets/page/multiple/build2.js",
      },
    },
  },

  server: {
    port: 19876
  },
});
```

## Bundle configuration

in your `config/packages/pentatrion_vite.yaml` file

```yaml
pentatrion_vite:

    default_build: build1
    builds:
        build1:
            build_directory: build-1
            script_attributes:
                # you can define your attributes that you want to apply
                # for all your script tags

            link_attributes:
                # you can define your attributes that you want to apply
                # for all your link tags

        build2:
            build_directory: build-2
            script_attributes:
                # etc

            link_attributes:
                # etc

```

in your templates

```twig
{% block stylesheets %}
    {# define your build in the 3rd parameter #}
    {{ vite_entry_link_tags('multiple', [], 'build2') }}

    {# no 3rd parameters it will be default_build -> build1 #}
    {{ vite_entry_link_tags('welcome') }}
{% endblock %}

{% block javascripts %}
    {# define your build in the 3rd parameter #}
    {{ vite_entry_script_tags('multiple', [], 'build2') }}

    {# no 3rd parameters it will be default_build -> build1 #}
    {{ vite_entry_script_tags('welcome') }}
{% endblock %}
```

to show your assets in dev mode

```yaml
# config/routes/dev/pentatrion_vite.yaml

# remove this default config
_pentatrion_vite: // [!code --]
    prefix: /build // [!code --]
    resource: "@PentatrionViteBundle/Resources/config/routing.yaml" // [!code --]

# add one route by build path
_pentatrion_vite_build1: // [!code ++]
    path: /build-1/{path} #same as your build1 base // [!code ++]
    defaults: // [!code ++]
        _controller: Pentatrion\ViteBundle\Controller\ViteController::proxyBuild // [!code ++]
        buildName: build1 // [!code ++]
    requirements: // [!code ++]
        path: ".+" // [!code ++]

_pentatrion_vite_build2: // [!code ++]
    path: /build-2/{path} #same as your build2 base // [!code ++]
    defaults: // [!code ++]
        _controller: Pentatrion\ViteBundle\Controller\ViteController::proxyBuild // [!code ++]
        buildName: build2 // [!code ++]
    requirements: // [!code ++]
        path: ".+" // [!code ++]
```

## Symfony Asset component configuration

Optional : if you want to use asset symfony component with custom strategy you need to add extra config...

```yaml
# config/services.yaml
services:
    pentatrion_vite.asset_strategy_build1:
        parent: Pentatrion\ViteBundle\Asset\ViteAssetVersionStrategy
        calls:
            - [setBuildName, ['build1']]

    pentatrion_vite.asset_strategy_build2:
        parent: Pentatrion\ViteBundle\Asset\ViteAssetVersionStrategy
        calls:
            - [setBuildName, ['build2']]
```

```yaml
# config/packages/framework.yaml
framework:
    assets:
        packages:
            build1:
                # same name as your service defined above
                version_strategy: 'pentatrion_vite.asset_strategy_build1'

            build2:
                version_strategy: 'pentatrion_vite.asset_strategy_build2'

```

after you can use your assets like this:
```twig
<img src="{{ asset('assets/images/violin.jpg', 'build1')}}" alt="">
```
