<?php

declare(strict_types=1);

use Pentatrion\ViteBundle\Asset\ViteAssetVersionStrategy;
use Pentatrion\ViteBundle\CacheWarmer\EntrypointsCacheWarmer;
use Pentatrion\ViteBundle\Controller\ProfilerController;
use Pentatrion\ViteBundle\Controller\ViteController;
use Pentatrion\ViteBundle\DataCollector\ViteCollector;
use Pentatrion\ViteBundle\EventListener\PreloadAssetsEventListener;
use Pentatrion\ViteBundle\Service\Debug;
use Pentatrion\ViteBundle\Service\EntrypointRenderer;
use Pentatrion\ViteBundle\Service\EntrypointsLookupCollection;
use Pentatrion\ViteBundle\Service\FileAccessor;
use Pentatrion\ViteBundle\Service\TagRendererCollection;
use Pentatrion\ViteBundle\Twig\EntryFilesTwigExtension;
use Pentatrion\ViteBundle\Twig\TypeExtension;
use Symfony\Component\Cache\Adapter\PhpArrayAdapter;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

use function Symfony\Component\DependencyInjection\Loader\Configurator\service;

return static function (ContainerConfigurator $containerConfigurator): void {
    $services = $containerConfigurator->services();

    $services->set('pentatrion_vite.entrypoints_lookup_collection', EntrypointsLookupCollection::class);
    $services->alias(EntrypointsLookupCollection::class, 'pentatrion_vite.entrypoints_lookup_collection');

    $services->set('pentatrion_vite.entrypoint_renderer', EntrypointRenderer::class)
        ->tag('kernel.reset', [
            'method' => 'reset',
        ])
        ->args([
            service('pentatrion_vite.entrypoints_lookup_collection'),
            service('pentatrion_vite.tag_renderer_collection'),
            '%pentatrion_vite.default_config%',
            '%pentatrion_vite.absolute_url%',
            service('request_stack')->nullOnInvalid(),
            service('event_dispatcher')->nullOnInvalid(),
        ]);
    $services->alias(EntrypointRenderer::class, 'pentatrion_vite.entrypoint_renderer');

    $services->set('pentatrion_vite.tag_renderer_collection', TagRendererCollection::class);
    $services->alias(TagRendererCollection::class, 'pentatrion_vite.tag_renderer_collection');

    $services->set('pentatrion_vite.twig_type_extension', TypeExtension::class)
        ->tag('twig.extension');

    $services->set('pentatrion_vite.twig_entry_files_extension', EntryFilesTwigExtension::class)
        ->tag('twig.extension')
        ->args([
            service('pentatrion_vite.entrypoint_renderer'),
        ]);

    $services->set(ViteCollector::class)
        ->tag('data_collector', [
            'id' => 'pentatrion_vite.vite_collector',
        ])
        ->args([
            service('pentatrion_vite.entrypoint_renderer'),
        ]);

    $services->set('pentatrion_vite.debug', Debug::class)
        ->args([
            '%pentatrion_vite.configs%',
            service('http_client'),
            service('pentatrion_vite.entrypoints_lookup_collection'),
            '%pentatrion_vite.proxy_origin%',
        ]);
    $services->alias(Debug::class, 'pentatrion_vite.debug');

    $services->set(ViteController::class)
        ->tag('controller.service_arguments')
        ->args([
            '%pentatrion_vite.default_config%',
            service('http_client'),
            service('pentatrion_vite.entrypoints_lookup_collection'),
            '%pentatrion_vite.proxy_origin%',
        ]);

    $services->set(ProfilerController::class)
        ->tag('controller.service_arguments')
        ->args([
            service('pentatrion_vite.debug'),
            service('twig'),
        ]);

    $services->set(ViteAssetVersionStrategy::class)
        ->args([
            service('pentatrion_vite.file_accessor'),
            '%pentatrion_vite.configs%',
            '%pentatrion_vite.default_config%',
            '%pentatrion_vite.absolute_url%',
            service('request_stack')->nullOnInvalid(),
            '%pentatrion_vite.throw_on_missing_asset%',
        ]);

    $services->set('pentatrion_vite.preload_assets_event_listener', PreloadAssetsEventListener::class)
        ->tag('kernel.event_subscriber')
        ->args([
            service('pentatrion_vite.entrypoint_renderer'),
        ]);

    $services->set('pentatrion_vite.file_accessor', FileAccessor::class)
        ->args([
            '%kernel.project_dir%%pentatrion_vite.public_directory%',
            '%pentatrion_vite.configs%',
            null,
        ]);

    $services->set('pentatrion_vite.cache', PhpArrayAdapter::class)
        ->factory([PhpArrayAdapter::class, 'create'])
        ->args([
            '%kernel.cache_dir%/pentatrion_vite.cache.php',
            service('cache.pentatrion_vite_fallback'),
        ]);

    $services->set('pentatrion_vite.cache_warmer', EntrypointsCacheWarmer::class)
        ->tag('kernel.cache_warmer')
        ->args([
            '%kernel.project_dir%%pentatrion_vite.public_directory%',
            '%pentatrion_vite.configs%',
            '%kernel.cache_dir%/pentatrion_vite.cache.php',
        ]);

    $services->set('cache.pentatrion_vite_fallback')
        ->tag('cache.pool')
        ->parent('cache.system');
};
