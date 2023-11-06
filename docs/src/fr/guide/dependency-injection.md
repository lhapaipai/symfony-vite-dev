# Injection de dépendances

si vous voulez plus de contrôle (comme créer des fonctions Twig personnalisées),
vous pouvez utiliser l'injection de dépendance avec `EntrypointRenderer` / `EntrypointsLookup`.

```php
use Twig\Extension\AbstractExtension;
use Pentatrion\ViteBundle\Service\EntrypointRenderer;
use Pentatrion\ViteBundle\Service\EntrypointsLookupCollection;
use Pentatrion\ViteBundle\Service\TagRendererCollection;

class YourTwigExtension extends AbstractExtension
{
    public function __contruct(
        private EntrypointRenderer $entrypointRenderer,

        // si vous voulez accéder aux services plus internes
        private EntrypointsLookupCollection $entrypointsLookupCollection,
        private TagRendererCollection $tagRendererCollection
    ) {
        $content = $this->entrypointRenderer->renderScripts(
          'app',  // entryName
          [],     // options
          null,   // nom de la config si vous en avez plusieurs.
          true    // toString (spécifiez false et vous aurez un tableau de Tag)
        );


        $entrypointsLookup = $this->entrypointsLookupCollection->getEntrypointsLookup();

        $viteServer = $entrypointsLookup->getViteServer();
        $jsFiles = $entrypointsLookup->getJSFiles('app');
        $cssFiles = $entrypointsLookup->getCSSFiles('app');
        // etc...
    }
}
```

