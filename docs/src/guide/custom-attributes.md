# Custom attributes on `<script>` and `<link>` tags

Custom attributes can be added to rendered `<script>` or `<link>` in 3 different ways :

- Via global config (`script_attributes` et `link_attributes`) : see the [Vite bundle reference](/reference/vite-bundle#script-attributes).

- When rendering in Twig - see the [Twig functions](/guide/twig-functions).

- By listening to the `Pentatrion\ViteBundle\Event\RenderAssetTagEvent` event.

Here is a complete example configuration :


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
