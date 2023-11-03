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
        return $this->render('default/welcome.html.twig', [
            'currentPage' => 'welcome',
        ]);
    }

    #[Route('/assets', name: 'assets')]
    public function assets(): Response
    {
        return $this->render('default/assets.html.twig', [
            'currentPage' => 'assets',
        ]);
    }

    #[Route('/imports', name: 'imports')]
    public function imports(): Response
    {
        return $this->render('default/imports.html.twig', [
            'currentPage' => 'imports',
        ]);
    }

    #[Route('/vue', name: 'vue')]
    public function vue(): Response
    {
        return $this->render('default/vue.html.twig', [
            'currentPage' => 'vue',
        ]);
    }

    #[Route('/react', name: 'react')]
    public function react(): Response
    {
        return $this->render('default/react.html.twig', [
            'currentPage' => 'react',
        ]);
    }
}
