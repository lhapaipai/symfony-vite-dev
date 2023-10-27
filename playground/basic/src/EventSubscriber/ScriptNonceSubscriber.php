<?php

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

    public static function getSubscribedEvents(): array
    {
        return [
            RenderAssetTagEvent::class => 'onRenderAssetTag',
        ];
    }
}
