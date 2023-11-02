# Attributs personnalisés sur les balises `<script>` et `<link>`

Des attributs personnalisés peuvent être ajoutés aux balises `<script>` et aux balises `<link>` de 3 manières différentes :

- Depuis la configuration globale (`script_attributes` et `link_attributes`) : voir dans la [référence Vite bundle](/fr/reference/vite-bundle#script-attributes).

- Dans les fonctions de rendu Twig : voir la documentation des [Fonctions Twig](/fr/guide/twig-functions).

- En écoutant l'événement `Pentatrion\ViteBundle\Event\RenderAssetTagEvent`.

Voici un exemple complet de configuration :


```yaml
# config/packages/pentatrion_vite.yaml
pentatrion_vite:
    script_attributes:
        foo: bar
```
```twig
{{ vite_entry_script_tags('app', {
  attr: {
    hello: 'world'
  }
}) }}
```

```php
// src/EventSubscriber/ScriptNonceSubscriber.php
namespace App\EventSubscriber;

use Pentatrion\ViteBundle\Event\RenderAssetTagEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ScriptNonceSubscriber implements EventSubscriberInterface
{
    public function onRenderAssetTag(RenderAssetTagEvent $event)
    {
        if ($event->isScriptTag() && $event->isBuild()) {
            $event->setAttribute('nonce', 'lookup nonce');
        }
        $event->setAttribute('foo', 'bar-modified');
    }

    public static function getSubscribedEvents()
    {
        return [
            RenderAssetTagEvent::class => 'onRenderAssetTag',
        ];
    }
}

```

vous obtiendrez ceci

```html
<script
  type="module"
  src="/build/assets/app-dc399f15.js"
  foo="bar-modified"
  hello="world"
  nonce="lookup nonce"
></script>
```
