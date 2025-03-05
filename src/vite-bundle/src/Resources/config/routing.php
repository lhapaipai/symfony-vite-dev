<?php

declare(strict_types=1);

use Pentatrion\ViteBundle\Controller\ViteController;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

return static function (RoutingConfigurator $routingConfigurator): void {
    $routingConfigurator->add('pentatrion_vite_build_proxy', '/{path}')
        ->controller([ViteController::class, 'proxyBuild'])
        ->requirements([
            'path' => '.+',
        ]);
};
