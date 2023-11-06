
# Dependency injection

if you want more control (like creating custom Twig functions),
you can use dependency injection with EntrypointRenderer.

```php
use Twig\Extension\AbstractExtension;
use Pentatrion\ViteBundle\Service\EntrypointRenderer;
use Pentatrion\ViteBundle\Service\EntrypointsLookupCollection;
use Pentatrion\ViteBundle\Service\TagRendererCollection;

class YourTwigExtension extends AbstractExtension
{
    public function __contruct(
        private EntrypointRenderer $entrypointRenderer,

        // or this if you want internal services
        private EntrypointsLookupCollection $entrypointsLookupCollection,
        private TagRendererCollection $tagRendererCollection
    ) {
        $content = $this->entrypointRenderer->renderScripts(
          'app',  // entryName
          [],     // options
          null,   // configName if you have multiple configs.
          true    // toString (specify false and you will have ane array of Tag)
        );


        $entrypointsLookup = $this->entrypointsLookupCollection->getEntrypointsLookup();

        $viteServer = $entrypointsLookup->getViteServer();
        $jsFiles = $entrypointsLookup->getJSFiles('app');
        $cssFiles = $entrypointsLookup->getCSSFiles('app');
        // etc...
    }
}
```

