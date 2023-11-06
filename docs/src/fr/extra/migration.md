# Migration

```bash
# vérifiez si votre version n'est plus à jour et notez
# quelle est la dernière version.
composer outdated

# à l'heure de l'écriture de ces lignes c'était la version 6.0
# Mettez à jour votre bundle en conséquence
composer require pentatrion/vite-bundle:^6.0

# Important ! Mettez à jour votre package npm vite-plugin-symfony
# avec la même version majeure et mineure.
npm i vite-plugin-symfony@^6.0
# ou
yarn upgrade vite-plugin-symfony@^6.0
```

Si vous faites une mise à jour vers une nouvelle version majeure,
vous aurez également quelques lignes de code à modifier.

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
