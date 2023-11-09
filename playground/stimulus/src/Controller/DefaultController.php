<?php

namespace App\Controller;

use App\Form\TimeForAMealFormType;
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

    #[Route('/autocomplete', name: 'autocomplete')]
    public function autocomplete(): Response
    {
        $foodForm = $this->createForm(TimeForAMealFormType::class);

        return $this->render('default/autocomplete.html.twig', [
            'foodForm' => $foodForm,
            'currentPage' => 'autocomplete',
        ]);
    }

    #[Route('/chartjs', name: 'chartjs')]
    public function chartjs(): Response
    {
        return $this->render('default/chartjs.html.twig', [
            'currentPage' => 'chartjs',
        ]);
    }

    #[Route('/cropperjs', name: 'cropperjs')]
    public function cropperjs(): Response
    {
        return $this->render('default/cropperjs.html.twig', [
            'currentPage' => 'cropperjs',
        ]);
    }

    #[Route('/dropzone', name: 'dropzone')]
    public function dropzone(): Response
    {
        return $this->render('default/dropzone.html.twig', [
            'currentPage' => 'dropzone',
        ]);
    }

    #[Route('/lazy-image', name: 'lazy-image')]
    public function lazyImage(): Response
    {
        return $this->render('default/lazy-image.html.twig', [
            'currentPage' => 'lazy-image',
        ]);
    }

    #[Route('/live-component', name: 'live-component')]
    public function liveComponent(): Response
    {
        return $this->render('default/live-component.html.twig', [
            'currentPage' => 'live-component',
        ]);
    }

    #[Route('/notify', name: 'notify')]
    public function notify(): Response
    {
        return $this->render('default/notify.html.twig', [
            'currentPage' => 'notify',
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

    #[Route('/turbo', name: 'turbo')]
    public function turbo(): Response
    {
        return $this->render('default/turbo.html.twig', [
            'currentPage' => 'turbo',
        ]);
    }

    #[Route('/typed', name: 'typed')]
    public function typed(): Response
    {
        return $this->render('default/typed.html.twig', [
            'currentPage' => 'typed',
        ]);
    }

    #[Route('/react', name: 'react')]
    public function react(): Response
    {
        return $this->render('default/react.html.twig', [
            'currentPage' => 'react',
        ]);
    }

    #[Route('/svelte', name: 'svelte')]
    public function svelte(): Response
    {
        return $this->render('default/svelte.html.twig', [
            'currentPage' => 'svelte',
        ]);
    }

    #[Route('/vue', name: 'vue')]
    public function vue(): Response
    {
        return $this->render('default/vue.html.twig', [
            'currentPage' => 'vue',
        ]);
    }
}
