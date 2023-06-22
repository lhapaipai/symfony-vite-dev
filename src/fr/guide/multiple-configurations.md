
# Configurations multiples avec Vite

Il est possible de combiner plusieurs fichiers de configuration Vite. Voici un modèle de configuration possible.


`package.json`
```json
{
  "scripts": {
    "dev": "vite -c vite.build1.config.js & vite -c vite.build2.config.js",
    "build": "vite build -c vite.build1.config.js && vite build -c vite.build2.config.js"
  }
}
```

## Configuration de Vite

définir 2 fichiers de configuration vite `vite.build1.config.js` et `vite.build2.config.js`.

```js
// vite.build1.config.js
import { defineConfig } from 'vite'
import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
  plugins: [
    symfonyPlugin({
      buildDirectory: 'build1'
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
      buildDirectory: 'build2'
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

## Configuration du Bundle

dans votre fichier `config/packages/pentatrion_vite.yaml`

```yaml
pentatrion_vite:

    default_build: build1
    builds:
        build1:
            build_directory: build1
            script_attributes:
                 # vous pouvez définir vos attributs que vous souhaitez
                 # appliquer pour toutes vos balises script

            link_attributes:
                 # vous pouvez définir vos attributs que vous souhaitez
                 # appliquer pour toutes vos balises lien

        build2:
            build_directory: build2
            script_attributes:
                # etc

            link_attributes:
                # etc

```

dans vos modèles

```twig
{% block stylesheets %}
    {# definissez votre nom de build dans le 3e paramètre #}
    {{ vite_entry_link_tags('multiple', [], 'build2') }}

    {# pas de 3e paramètre, ce sera default_build -> build1 #}
    {{ vite_entry_link_tags('welcome') }}
{% endblock %}

{% block javascripts %}
    {# definissez votre nom de build dans le 3e paramètre #}
    {{ vite_entry_script_tags('multiple', [], 'build2') }}

    {# pas de 3e paramètre, ce sera default_build -> build1 #}
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
_pentatrion_vite_build1: // [!code ++]
    path: /build1/{path} #same as your build1 base // [!code ++]
    defaults: // [!code ++]
        _controller: Pentatrion\ViteBundle\Controller\ViteController::proxyBuild // [!code ++]
        buildName: build1 // [!code ++]
    requirements: // [!code ++]
        path: ".+" // [!code ++]

_pentatrion_vite_build2: // [!code ++]
    path: /build2/{path} #same as your build2 base // [!code ++]
    defaults: // [!code ++]
        _controller: Pentatrion\ViteBundle\Controller\ViteController::proxyBuild // [!code ++]
        buildName: build2 // [!code ++]
    requirements: // [!code ++]
        path: ".+" // [!code ++]
```

## Configuration du composant Symfony Asset

Facultatif : si vous souhaitez utiliser le composant Symfony Asset avec une stratégie personnalisée, vous devez ajouter une configuration supplémentaire...

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

après vous pouvez faire référence à vos ressources comme ceci :
```twig
<img src="{{ asset('assets/images/violin.jpg', 'build1')}}" alt="">
```
