<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'app_welcome')]
    public function welcome(): Response
    {
        return $this->render('default/welcome.html.twig', [
            'controller_name' => 'DefaultController',
        ]);
    }

    #[Route('/', name: 'app_page1')]
    public function page1(): Response
    {
        return $this->render('default/page-1.html.twig', [
            'controller_name' => 'DefaultController',
        ]);
    }

    #[Route('/', name: 'app_page2')]
    public function page2(): Response
    {
        return $this->render('default/page-2.html.twig', [
            'controller_name' => 'DefaultController',
        ]);
    }
}
