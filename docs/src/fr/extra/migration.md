# Migration

```bash
# vérifiez si votre version n'est plus à jour et notez
# quelle est la dernière version.
composer outdated

# Mettez à jour votre bundle en conséquence
composer require pentatrion/vite-bundle:^7.0

# Important ! Mettez à jour votre package npm vite-plugin-symfony
# avec la même version majeure et mineure.
npm i vite-plugin-symfony@^7.0
# ou
yarn upgrade vite-plugin-symfony@^7.0
```

Si vous faites une mise à jour vers une nouvelle version majeure,
vous aurez également quelques lignes de code à modifier.

## v6.x vers v7.x


### Nouvelle route

La version 7 ajoute une nouvelle route pour le profileur Symfony et vous rencontrerez probablement une erreur avec celle-ci (An error occurred while loading the web debug toolbar. Open the web profiler.) tant que vous n'aurez pas mis à jour votre recette.

Mettez à jour votre recette

```bash
composer recipes:update pentatrion/vite-bundle
```

Elle va remplacer votre fichier `./config/routes/dev/pentatrion_vite.yaml` par celui-ci `./config/routes/pentatrion_vite.yaml` qui utilise `when@dev` et ajoutera une nouvelle route.

Si vous souhaitez faire cette mise à jour manuellement

supprimez votre fichier `config/routes/dev/pentatrion_vite.yaml` et ajoutez celui-ci à la place. Si vous avez une configuration multiple voir plus bas

```yaml
# config/routes/pentatrion_vite.yaml
when@dev:
    _pentatrion_vite:
        prefix: /build
        resource: "@PentatrionViteBundle/Resources/config/routing.yaml"

    _profiler_vite:
        path: /_profiler/vite
        defaults:
            _controller: Pentatrion\ViteBundle\Controller\ProfilerController::info

```

### `crossorigin`

l'option `crossorigin` pour vite-bundle est à `true` par défaut (l'anciennement sa valeur par défaut était `false`).
Normalement vous n'auriez pas à changer ce comportement vers `false`. Si vous rencontrez des problèmes avec cette option, n'hésitez pas à ouvrir une *issue*.

```yaml
# config/packages/pentatrion_vite.yaml
pentatrion_vite:
  crossorigin: true
```

### Stimulus

Si vous utilisez Stimulus, des changements seront à apporter sur votre fichier `bootstrap.js` avec l'apparition du suffixe `?stimulus` et l'activation de l'option `eager` à `true` pour `import.meta.glob`.

```js
import { registerControllers } from "vite-plugin-symfony/stimulus/helpers";

registerControllers( // [!code --]
  app, // [!code --]
  import.meta.glob('./controllers/*_(lazy)\?controller.[jt]s(x)\?') // [!code --]
) // [!code --]

registerControllers( // [!code ++]
  app, // [!code ++]
  import.meta.glob('./controllers/*_controller.js', { // [!code ++]
    query: "?stimulus", // [!code ++]
    eager: true, // [!code ++]
  }) // [!code ++]
) // [!code ++]
```

la configuration plus fine des contrôleurs (notamment le comportement `lazy`) se fera
à travers les `import.meta`. voir [Stimulus reference](/fr/stimulus/reference.html).

### CDN

si vous utilisez un CDN pensez à bien remplir les options, `base` et `build.outDir`.

```js
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return {
    base:
      mode === "development"
        ? "/build/"
        : "http://cdn.custom-domain.com",

    publicDir: false,

    build: {
      outDir: "./public/build",
      rollupOptions: {
        input: {
          app: "./assets/app.js",
        },
      },
    },
  };
});

```

Si vous n'avez pas des [configurations multiples](/fr/guide/multiple-configurations) c'est déja terminé...

### Configurations multiples

Sinon vous aurez besoin de mettre à jour votre fichier `config/routes/pentatrion_vite.yaml`.


```yaml
# config/routes/pentatrion_vite.yaml
when@dev:
    # retirer la route par défaut
    _pentatrion_vite: // [!code --]
        prefix: /build // [!code --]
        resource: "@PentatrionViteBundle/Resources/config/routing.yaml" // [!code --]

    # et remettre votre routes personnalisées comme avant
    _pentatrion_vite_config1: // [!code ++]
        path: /build-1/{path} # comme l'option base de config1 // [!code ++]
        defaults: // [!code ++]
            _controller: Pentatrion\ViteBundle\Controller\ViteController::proxyBuild // [!code ++]
            configName: config1 // [!code ++]
        requirements: // [!code ++]
            path: ".+" // [!code ++]

    _pentatrion_vite_config2: // [!code ++]
        path: /build-2/{path} # comme l'option base de config2 // [!code ++]
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


## v5.x vers v6.x


### `RenderAssetTagEvent`

Si vous avez créé une classe qui écoutait l'événement `Pentatrion\ViteBundle\Event\RenderAssetTagEvent`.
L'instance `$event` possède des méthodes différentes qui permettent un contrôle plus complet de la génération des balises html. Consultez le code source de [RenderAssetTagEvent](https://github.com/lhapaipai/vite-bundle/blob/main/src/Event/RenderAssetTagEvent.php) et [Tag](https://github.com/lhapaipai/vite-bundle/blob/main/src/Model/Tag.php).

```php
// src/EventSubscriber/ScriptNonceSubscriber.php
namespace App\EventSubscriber;

use Pentatrion\ViteBundle\Event\RenderAssetTagEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ScriptNonceSubscriber implements EventSubscriberInterface
{
    public function onRenderAssetTag(RenderAssetTagEvent $event)
    {
        $tag = $event->getTag();
        if ($tag->isInternal()) {
            return;
        }
        if ($tag->isScriptTag() && $event->isBuild()) {
            $tag->setAttribute('nonce', 'lookup nonce');
        }
        $tag->setAttribute('foo', 'bar-modified');
    }

    public static function getSubscribedEvents()
    {
        return [
            RenderAssetTagEvent::class => 'onRenderAssetTag',
        ];
    }
}
```
### Injection de dépendances

Si vous injectiez des services associés au bundle dans vos propres services quelques ajustements seront nécessaires.

```php
use Twig\Extension\AbstractExtension;
use Pentatrion\ViteBundle\Asset\EntrypointRenderer; // [!code --]
use Pentatrion\ViteBundle\Asset\EntrypointsLookup; // [!code --]
use Pentatrion\ViteBundle\Service\EntrypointRenderer; // [!code ++]
use Pentatrion\ViteBundle\Service\EntrypointsLookupCollection; // [!code ++]

class YourTwigExtension extends AbstractExtension
{
    public function __contruct(
        private EntrypointsLookup $entrypointsLookup, // [!code --]
        private EntrypointsLookupCollection $entrypointsLookupCollection, // [!code ++]
        private EntrypointRenderer $entrypointRenderer
    ) {
        $entrypointsLookup = $entrypointsLookupCollection->getEntrypointsLookup(); // [!code ++]
        // ...
    }


}
```

### Configurations multiples

L'utilisation du terme `build` était inadaptée pour parler des différentes configurations il a été remplacé par `config`.

Il vous faudra donc faire quelques remplacements dans votre configuration.

Dans le fichier `pentatrion_vite.yaml`, les options `default_build` et `builds` ont été remplacées par `default_config` et `configs`.

```yaml
# config/packages/pentatrion_vite.yaml
pentatrion_vite:
    default_build: config1 // [!code --]
    default_config: config1 // [!code ++]

    builds: // [!code --]
    configs: // [!code ++]
        config1:
            build_directory: build-1
            # ...

        config2:
            build_directory: build-2
            # ...
```

```yaml
# config/services.yaml
services:
    pentatrion_vite.asset_strategy_build1: // [!code --]
    pentatrion_vite.asset_strategy_config1: // [!code ++]
        parent: Pentatrion\ViteBundle\Asset\ViteAssetVersionStrategy
        calls:
            - [setBuildName, ['config1']] // [!code --]
            - [setConfig, ['config1']] // [!code ++]

```

```yaml
# config/routes/dev/pentatrion_vite.yaml
_pentatrion_vite_build1:
    path: /build-1/{path} #same as your build1 base
    defaults:
        _controller: Pentatrion\ViteBundle\Controller\ViteController::proxyBuild
        buildName: build1 // [!code --]
        configName: config1 // [!code ++]
    requirements:
        path: ".+"
```

```yaml
# config/packages/framework.yaml
framework:
    assets:
        packages:
            build1:
                # same name as your service defined above
                version_strategy: 'pentatrion_vite.asset_strategy_build1' // [!code --]
                version_strategy: 'pentatrion_vite.asset_strategy_config1' // [!code ++]
```


## v4.x vers v5.x

Veuillez à mettre à jour votre Bundle `pentatrion/vite-bundle` à la version 5.x avec composer mais aussi votre paquet node `vite-plugin-symfony` vers une version 5.x.

Si vous utilisez la fonction Twig `vite_mode`, les 3 valeurs possibles sont désormais : `"dev"` | `"build"` | `null`.

C'est terminé !

## Migration Vite-Bundle de la v0.2.x à la v1.x

Dans la version v0.2.x, vous devez spécifier vos points d'entrée dans un tableau dans votre fichier `vite.config.js`. dans v1.x, vous devez spécifier vos points d'entrée dans un objet.

```diff
-input: ["./assets/app.js"],
+input: {
+  app: "./assets/app.js"
+},
```

de cette façon, vous devez spécifier le point d'entrée nommé dans vos fonctions Twig.

```diff
-{{ vite_entry_script_tags('app.js') }}
+{{ vite_entry_script_tags('app') }}
-{{ vite_entry_link_tags('app.js') }}
+{{ vite_entry_link_tags('app') }}
```

Dans la v1.x, votre symfonyPlugin est une **fonction** et provient du paquet `vite-plugin-symfony`.

```diff
+ import symfonyPlugin from 'vite-plugin-symfony';

    // ...
    plugins: [
-       symfonyPlugin,
+       symfonyPlugin(),
    ],
```
