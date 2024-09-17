<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/swup', name: 'swup-')]
class SwupController extends AbstractController
{
    #[Route('/page-1', name: 'page-1')]
    public function page1(): Response
    {
        return $this->render('swup/page-1.html.twig', [
            'currentPage' => 'swup-page-1',
        ]);
    }

    #[Route('/page-2', name: 'page-2')]
    public function page2(): Response
    {
        return $this->render('swup/page-2.html.twig', [
            'currentPage' => 'swup-page-2',
        ]);
    }

    #[Route('/page-3', name: 'page-3')]
    public function page3(): Response
    {
        return $this->render('swup/page-3.html.twig', [
            'currentPage' => 'swup-page-3',
        ]);
    }
}
