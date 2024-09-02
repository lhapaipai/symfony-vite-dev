# Troubleshooting 🧐

## Unwanted reloads

If you experience unwanted reloads of your application, read the section [https/http in development](#https--http-in-development).

## Flash unstyles content

If you want to reduce the FOUC ([flash of unstyled content](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)), read the [Tips : css file as entrypoint](/guide/tips#css-files-as-entrypoint) page section.

## Assets < 4kb

When referring to asset files smaller than 4kb, an exception may occur during template rendering. This exception is triggered when the referenced asset, such as 'assets/images/small-asset-less-than-4kb.png', is not found in the manifest file located at '/path-to-your-project/public/build/manifest.json'.
  By default, Vite inlines the content of small asset files. Consequently, you won't be able to reference these files using the Twig asset function.

```twig
<img src="{{ asset('assets/images/logo-symfony-less-4kb.png') }}">
```

You may work around this by explicitly configuring Vite to disable asset inlining by setting the configuration option [`build.assetsInlineLimit`](https://vitejs.dev/config/build-options.html#build-assetsinlinelimit) to 0.

## No style in your error pages

When an error occurs and a 500 page is generated, it can happen that your scripts or styles are not loaded.

When you call `vite_entry_link_tags` or `vite_entry_script_tags`, the bundle keeps in memory the generated html tags in order to not generate the same tags twice. This will be the expected behavior in most cases.

However, in the case where an error is thrown after calling `vite_entry_link_tags`  and the twig error template calls `vite_entry_link_tags` again. It is likely that some tags will be missing.

This can be solved by listening to the `ExceptionEvent` event and doing a reset of the generated tags.



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

More details : [#38 when an error occurs and a 500 page is generated the css is not loaded](https://github.com/lhapaipai/symfony-vite-dev/issues/38#issuecomment-2298578368).
