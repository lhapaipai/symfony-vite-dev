<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'page-build-1')]
    public function build1(): Response
    {
        return $this->render('default/build-1.html.twig', [
            'currentPage' => 'build-1',
        ]);
    }

    #[Route('/page-2', name: 'page-build-2')]
    public function build2(): Response
    {
        return $this->render('default/build-2.html.twig', [
            'currentPage' => 'build-2',
        ]);
    }
}
