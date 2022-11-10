<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class WelcomeController extends AbstractController
{
    #[Route('/', name: 'welcome')]
    public function index(): Response
    {
        return $this->render('welcome/index.html.twig', [
            'controller_name' => 'WelcomeController',
        ]);
    }

    #[Route('/user/{name}', name: 'user_name')]
    public function user($name): Response
    {
        return $this->render('welcome/user.html.twig', [
            'name' => $name,
        ]);
    }
}
