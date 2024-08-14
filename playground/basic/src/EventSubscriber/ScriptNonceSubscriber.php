<?php

namespace App\EventSubscriber;

use Pentatrion\ViteBundle\Event\RenderAssetTagEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class ScriptNonceSubscriber implements EventSubscriberInterface
{
    public function onRenderAssetTag(RenderAssetTagEvent $event)
    {
        // $tag = $event->getTag();
        // if ($tag->isInternal()) {
        //     return;
        // }
        // if ($tag->isScriptTag() && $event->isBuild()) {
        //     $tag->setAttribute('nonce', 'lookup nonce');
        // }
        // $tag->setAttribute('foo', 'bar-modified');
    }

    public static function getSubscribedEvents(): array
    {
        return [
            RenderAssetTagEvent::class => 'onRenderAssetTag',
        ];
    }
}
