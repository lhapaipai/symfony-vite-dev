# Résolution de problèmes 🧐

## Rechargements fréquents

si vous rencontrez des rechargements intempestifs de votre application, lisez la section [https/http en développement](/fr/guide/tips.html#https-http-en-developpement).

## Flash unstyles content

si vous souhaitez réduire le FOUC ([flash of unstyled content](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)), lisez les [Astuces : fichier css comme point d'entrée](/fr/guide/tips.html#fichiers-css-comme-point-d-entree).

## Assets < 4kb

Si vous faites référence à des fichiers d'assets de moins de 4kb. **An exception has been thrown during the rendering of a template (assets "assets/images/small-asset-less-than-4kb.png" not found in manifest file "/path-to-your-project/public/build/manifest.json".)** si vous faites référence à un fichier d'asset de moins de 4kb, Vite aura choisi par défaut de rendre son contenu en ligne. Vous ne pourrez donc pas faire référence à ce fichier en utilisant la fonction Twig `asset`.

```twig
<img src="{{ asset('assets/images/logo-symfony-less-4kb.png') }}">
```
Une solution peut-être de demander explicitement à Vite de ne pas rendre en ligne ses assets en définissant la configuration de vite [`build.assetsInlineLimit`](https://vitejs.dev/config/build-options.html#build-assetsinlinelimit) à 0.

## Pas de style dans vos pages d'erreur

Lorsqu'une erreur se produit et qu'une page 500 est générée, il peut arriver que vos scripts ou styles ne soient pas chargés.

Lorsque vous appelez `vite_entry_link_tags` ou `vite_entry_script_tags`, le bundle garde en mémoire les balises html générées ce qui permet de ne pas générer 2 fois les mêmes balises. Ce sera le comportement attendu dans la plupart des cas.

Cependant, dans le cas où une erreur est levée après l'appel de `vite_entry_link_tags` et que vous faites un nouvel appel à `vite_entry_link_tags` dans votre template `twig` d'affichage d'erreur il est probable que certaines balises manqueront.

Ceci peut-être résolu en écoutant l'événement `ExceptionEvent` et en faisant un reset des balises générées.

```php
use Pentatrion\ViteBundle\Service\EntrypointRenderer;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;

#[AsEventListener]
class ExceptionListener
{
    public function __construct(private readonly EntrypointRenderer $entrypointRenderer)
    {
    }

    public function __invoke(ExceptionEvent $event): void
    {
        if ($event->getThrowable() instanceof \Twig\Error\RuntimeError) {
            $this->entrypointRenderer->reset();
        }
    }
}
```

Plus de détails [#38 when an error occurs and a 500 page is generated the css is not loaded](https://github.com/lhapaipai/symfony-vite-dev/issues/38#issuecomment-2298578368).
