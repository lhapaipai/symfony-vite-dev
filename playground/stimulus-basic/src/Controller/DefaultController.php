<?php

namespace App\Controller;

use App\Form\UserType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'root')]
    public function root(): Response
    {
        return $this->render('default/root.html.twig', [
            'currentPage' => 'root',
        ]);
    }

    #[Route('/welcome', name: 'welcome')]
    public function welcome(): Response
    {
        return $this->render('default/welcome.html.twig', [
            'currentPage' => 'welcome',
        ]);
    }

    #[Route('/counter', name: 'counter')]
    public function counter(): Response
    {
        return $this->render('default/counter.html.twig', [
            'currentPage' => 'counter',
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

    #[Route('/other', name: 'other')]
    public function other(): Response
    {
        return $this->render('default/other.html.twig', [
            'currentPage' => 'other',
        ]);
    }
}
