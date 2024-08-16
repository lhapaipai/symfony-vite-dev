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
        return $this->render('default/welcome.html.twig', [
            'currentPage' => 'welcome',
        ]);
    }

    #[Route('/eager', name: 'eager')]
    public function eager(): Response
    {
        return $this->render('default/eager.html.twig', [
            'currentPage' => 'eager',
        ]);
    }

    #[Route('/lazy', name: 'lazy')]
    public function lazy(): Response
    {
        return $this->render('default/lazy.html.twig', [
            'currentPage' => 'lazy',
        ]);
    }

    #[Route('/third-party', name: 'third-party')]
    public function thirdParty(): Response
    {
        return $this->render('default/third-party.html.twig', [
            'currentPage' => 'third-party',
        ]);
    }

    #[Route('/toggle-password', name: 'toggle-password')]
    public function togglePassword(): Response
    {
        $form = $this->createForm(UserType::class);

        return $this->render('default/toggle-password.html.twig', [
            'form' => $form,
            'currentPage' => 'toggle-password',
        ]);
    }
}
