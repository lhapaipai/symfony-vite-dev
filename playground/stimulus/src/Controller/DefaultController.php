<?php

namespace App\Controller;

use App\Form\UserType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'welcome')]
    public function welcome(): Response
    {
        $form = $this->createForm(UserType::class);

        return $this->render('default/welcome.html.twig', [
            'currentPage' => 'welcome',
            'form' => $form,
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
