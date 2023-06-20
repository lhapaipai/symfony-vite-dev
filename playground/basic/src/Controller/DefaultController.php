<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'welcome')]
    public function welcome(): Response
    {
        return $this->render('default/welcome.html.twig');
    }

    #[Route('/assets', name: 'page_assets')]
    public function assets(): Response
    {
        return $this->render('default/page_assets.html.twig');
    }

    #[Route('/imports', name: 'page_imports')]
    public function imports(): Response
    {
        return $this->render('default/page_imports.html.twig');
    }
}
