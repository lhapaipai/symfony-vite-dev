
# Multiple Vite Configurations 🏗️

It's possible to combine multiple Vite configuration files. Here is a possible configuration model.

`package.json`
```json
{
  "dependencies": {
    "concurrently": "^8",
  },
  "scripts": {
    "dev": "concurrently \"vite -c vite.config1.config.js\" \"vite -c vite.config2.config.js\"",
    "build": "vite build -c vite.config1.config.js && vite build -c vite.config2.config.js"
  }
}
```

## Vite configuration

Define 2 vite config files `vite.config1.config.js` and `vite.config2.config.js`.

```js{6,13}
// vite.config1.config.js
import { defineConfig } from 'vite'
import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
  base: '/build-1/',

  plugins: [
    symfonyPlugin(),
  ],

  build: {
    outDir: 'public/build-1',

    rollupOptions: {
      input: {
        "welcome": "./assets/page/welcome/index.js",
        "theme": "./assets/theme.scss"
      },
    },
  }
});
```

```js{6,13}
// vite.config2.config.js
import { defineConfig } from 'vite'
import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
  base: '/build-2/',

  plugins: [
    symfonyPlugin(),
  ],

  build: {
    outDir: 'public/build-2',
    rollupOptions: {
      input: {
        "other": "./assets/page/other/index.js",
      },
    },
  }
});

```

## Bundle configuration

In your `config/packages/pentatrion_vite.yaml` file:

```yaml
pentatrion_vite:

    default_config: config1
    configs:
        config1:
            build_directory: build-1
            script_attributes:
                # you can define attributes that you want to apply
                # for all your script tags

            link_attributes:
                # you can define attributes that you want to apply
                # for all your link tags

        config2:
            build_directory: build-2
            script_attributes:
                # etc

            link_attributes:
                # etc

```

In your templates:

```twig
{% block stylesheets %}
    {# define your config name in the 3rd parameter #}
    {{ vite_entry_link_tags('other', [], 'config2') }}

    {# no 3rd parameters it will be default_config -> config1 #}
    {{ vite_entry_link_tags('welcome') }}
{% endblock %}

{% block javascripts %}
    {# define your config name in the 3rd parameter #}
    {{ vite_entry_script_tags('other', [], 'config2') }}

    {# no 3rd parameters it will be default_config -> config1 #}
    {{ vite_entry_script_tags('welcome') }}
{% endblock %}
```

To show your assets in dev mode:

```yaml
# config/routes/dev/pentatrion_vite.yaml

# remove this default config
_pentatrion_vite: // [!code --]
    prefix: /build // [!code --]
    resource: "@PentatrionViteBundle/Resources/config/routing.yaml" // [!code --]

# add one route by build path
_pentatrion_vite_config1: // [!code ++]
    path: /build-1/{path} #same as your config1 base // [!code ++]
    defaults: // [!code ++]
        _controller: Pentatrion\ViteBundle\Controller\ViteController::proxyBuild // [!code ++]
        configName: config1 // [!code ++]
    requirements: // [!code ++]
        path: ".+" // [!code ++]

_pentatrion_vite_config2: // [!code ++]
    path: /build-2/{path} #same as your config2 base // [!code ++]
    defaults: // [!code ++]
        _controller: Pentatrion\ViteBundle\Controller\ViteController::proxyBuild // [!code ++]
        configName: config2 // [!code ++]
    requirements: // [!code ++]
        path: ".+" // [!code ++]

_profiler_vite:
    path: /_profiler/vite
    defaults:
        _controller: Pentatrion\ViteBundle\Controller\ProfilerController::info
```

## Symfony Asset component configuration

Optional: if you want to use Symfony's asset component with a custom strategy you need to add extra config:

```yaml
# config/services.yaml
services:
    pentatrion_vite.asset_strategy_config1:
        parent: Pentatrion\ViteBundle\Asset\ViteAssetVersionStrategy
        calls:
            - [setConfig, ['config1']]

    pentatrion_vite.asset_strategy_config2:
        parent: Pentatrion\ViteBundle\Asset\ViteAssetVersionStrategy
        calls:
            - [setConfig, ['config2']]
```

```yaml
# config/packages/framework.yaml
framework:
    assets:
        packages:
            config1:
                # same name as your service defined above
                version_strategy: 'pentatrion_vite.asset_strategy_config1'

            config2:
                version_strategy: 'pentatrion_vite.asset_strategy_config2'

```

After you can use your assets like this:

```twig
<img src="{{ asset('assets/images/violin.jpg', 'config1')}}" alt="">
```
