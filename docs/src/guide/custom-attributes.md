# Custom attributes on `<script>` and `<link>` tags

Custom attributes can be added to rendered `<script>` or `<link>` tags in 3 different ways (by order of priority):

- Via global config (`script_attributes` et `link_attributes`): see the [Vite bundle reference](/reference/vite-bundle#script-attributes).

- When rendering in Twig - see the [Twig functions](/guide/twig-functions).

- By listening to the `Pentatrion\ViteBundle\Event\RenderAssetTagEvent` ([source code](https://github.com/lhapaipai/vite-bundle/blob/main/src/Event/RenderAssetTagEvent.php)) event.

Here is a complete example configuration:

## Global attributes

```yaml
# config/packages/pentatrion_vite.yaml
pentatrion_vite:
    script_attributes:
        foo: bar
```

## Local attributes

```twig
{{ vite_entry_script_tags('app', {
  attr: {
    hello: 'world'
  }
}) }}
```

## Subscribe to `RenderAssetTagEvent` 🧩

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

## Result

You will get this:

```html
<script
  type="module"
  src="/build/assets/app-dc399f15.js"
  foo="bar-modified"
  hello="world"
  nonce="lookup nonce"
></script>
```
