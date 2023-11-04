
# Configurations multiples avec Vite

Il est possible de combiner plusieurs fichiers de configuration Vite. Voici un modèle de configuration possible.


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

## Configuration de Vite

définir 2 fichiers de configuration vite `vite.config1.config.js` et `vite.config2.config.js`.

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
  },
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
        "multiple": "./assets/page/multiple/config2.js",
      },
    },
  },
});
```

## Configuration du Bundle

dans votre fichier `config/packages/pentatrion_vite.yaml`

```yaml
pentatrion_vite:

    default_config: config1
    configs:
        config1:
            build_directory: build-1
            script_attributes:
                 # vous pouvez définir les attributs que vous souhaitez
                 # appliquer pour toutes vos balises script

            link_attributes:
                 # vous pouvez définir les attributs que vous souhaitez
                 # appliquer pour toutes vos balises lien

        config2:
            build_directory: build-2
            script_attributes:
                # etc

            link_attributes:
                # etc

```

dans vos modèles

```twig
{% block stylesheets %}
    {# definissez le nom de votre config dans le 3e paramètre #}
    {{ vite_entry_link_tags('multiple', [], 'config2') }}

    {# pas de 3e paramètre, ce sera default_config -> config1 #}
    {{ vite_entry_link_tags('welcome') }}
{% endblock %}

{% block javascripts %}
    {# definissez le nom de votre config dans le 3e paramètre #}
    {{ vite_entry_script_tags('multiple', [], 'config2') }}

    {# pas de 3e paramètre, ce sera default_config -> config1 #}
    {{ vite_entry_script_tags('welcome') }}
{% endblock %}
```

pour afficher vos ressources en mode dev

```yaml
# config/routes/dev/pentatrion_vite.yaml

# supprimer cette configuration par défaut
_pentatrion_vite: // [!code --]
    prefix: /build // [!code --]
    resource: "@PentatrionViteBundle/Resources/config/routing.yaml" // [!code --]

# ajouter une route par chemin de build
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
```

## Configuration du composant Symfony Asset

Facultatif : si vous souhaitez utiliser le composant Symfony Asset avec une stratégie personnalisée, vous devez ajouter une configuration supplémentaire...

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

après vous pouvez faire référence à vos ressources comme ceci :
```twig
<img src="{{ asset('assets/images/violin.jpg', 'config1')}}" alt="">
```
