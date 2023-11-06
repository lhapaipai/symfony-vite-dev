# Migration

```bash
# check if your version is outdated
# and get what is the latest version
composer outdated

# at the time of writing this, it was the version 6.0
# so update your bundle to this version
composer require pentatrion/vite-bundle:^6.0

# Important ! update your vite-plugin-symfony npm package
# to the same Major and version.
npm i vite-plugin-symfony@^6.0
# or
yarn upgrade vite-plugin-symfony@^6.0
```

If you upgrade to a new major version

## from v5.x to v6.x

### `RenderAssetTagEvent`

If you created a class that listened to the `Pentatrion\ViteBundle\Event\RenderAssetTagEvent` event.
The `$event` instance has different methods that allow more complete control of the generation of html tags. See the source code for [RenderAssetTagEvent](https://github.com/lhapaipai/vite-bundle/blob/main/src/Event/RenderAssetTagEvent.php) and [Tag](https://github.com/lhapaipai/ vite-bundle/blob/main/src/Model/Tag.php).


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
### Dependency injection

If you inject services associated with the bundle into your own services some adjustments will be necessary.


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

### Multiple configurations

The use of the term `build` was unsuitable to talk about the different configurations; it was replaced by `config`.

You will therefore need to make some replacements in your configuration.

In the `pentatrion_vite.yaml` file, the `default_build` and `builds` options have been replaced by `default_config` and `configs` respectively.


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


## from v4.x to v5.x

Please update your Bundle `pentatrion/vite-bundle` to version 5.x with composer but also your node package `vite-plugin-symfony` to 5.x.

If you use the `vite_mode` twig function, the 3 possible values are now: `"dev"` | `"build"` | `null`.

It's over !

## Vite-Bundle migration from v0.2.x to v1.x

In version v0.2.x, you have to specify your entry points in an array in your `vite.config.js` file. in v1.x you need to specify your entry points in an object.

```diff
-input: ["./assets/app.js"],
+input: {
+  app: "./assets/app.js"
+},
```

this way you need to specify the named entry point in your twig functions.

```diff
-{{ vite_entry_script_tags('app.js') }}
+{{ vite_entry_script_tags('app') }}
-{{ vite_entry_link_tags('app.js') }}
+{{ vite_entry_link_tags('app') }}
```

In v1.x, your symfonyPlugin is a **function** and come from the `vite-plugin-symfony` package.

```diff
+ import symfonyPlugin from 'vite-plugin-symfony';

    // ...
    plugins: [
-       symfonyPlugin,
+       symfonyPlugin(),
    ],
```
