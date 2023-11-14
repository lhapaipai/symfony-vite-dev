<?php

namespace App\Controller;

use App\Form\UserType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\UX\Chartjs\Builder\ChartBuilderInterface;
use Symfony\UX\Chartjs\Model\Chart;
use Symfony\UX\Cropperjs\Factory\CropperInterface;
use Symfony\UX\Cropperjs\Form\CropperType;
use Symfony\UX\Dropzone\Form\DropzoneType;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'welcome')]
    public function welcome(): Response
    {
        return $this->render('default/welcome.html.twig', [
            'currentPage' => 'welcome',
        ]);
    }

    #[Route('/third-party', name: 'third-party')]
    public function thirdParty(): Response
    {
        return $this->render('default/third-party.html.twig', [
            'currentPage' => 'third-party',
        ]);
    }

    #[Route('/autocomplete', name: 'autocomplete')]
    public function autocomplete(): Response
    {
        $foodForm = $this->createFormBuilder()
            ->add('portionSize', ChoiceType::class, [
                'choices' => [
                    'Choose a portion size' => '',
                    'small' => 's',
                    'medium' => 'm',
                    'large' => 'l',
                    'extra large' => 'xl',
                    'all you can eat' => '∞',
                ],
                'autocomplete' => true,
            ])
            ->getForm();

        return $this->render('default/autocomplete.html.twig', [
            'foodForm' => $foodForm,
            'currentPage' => 'autocomplete',
        ]);
    }

    #[Route('/chartjs', name: 'chartjs')]
    public function chartjs(ChartBuilderInterface $chartBuilder): Response
    {
        $chart = $chartBuilder->createChart(Chart::TYPE_LINE);

        $chart->setData([
            'labels' => ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            'datasets' => [
                [
                    'label' => 'My First dataset',
                    'backgroundColor' => 'rgb(255, 99, 132)',
                    'borderColor' => 'rgb(255, 99, 132)',
                    'data' => [0, 10, 5, 2, 20, 30, 45],
                ],
            ],
        ]);

        $chart->setOptions([
            'scales' => [
                'y' => [
                    'suggestedMin' => 0,
                    'suggestedMax' => 100,
                ],
            ],
        ]);

        return $this->render('default/chartjs.html.twig', [
            'chart' => $chart,
            'currentPage' => 'chartjs',
        ]);
    }

    #[Route('/cropperjs', name: 'cropperjs')]
    public function cropperjs(CropperInterface $cropper, Request $request, $uploadsDir): Response
    {
        $crop = $cropper->createCrop($uploadsDir.'/symfony-vite.png');
        $crop->setCroppedMaxSize(400, 400);

        $form = $this->createFormBuilder(['crop' => $crop])
            ->add('crop', CropperType::class, [
                'public_url' => '/uploads/symfony-vite.png',
                'cropper_options' => [
                    'aspectRatio' => 1,
                ],
            ])
            ->getForm()
        ;

        return $this->render('default/cropperjs.html.twig', [
            'cropForm' => $form,
            'currentPage' => 'cropperjs',
        ]);
    }

    #[Route('/dropzone', name: 'dropzone')]
    public function dropzone(): Response
    {
        $form = $this->createFormBuilder()
            ->add('photo', DropzoneType::class)
            ->getForm()
        ;

        return $this->render('default/dropzone.html.twig', [
            'photoForm' => $form,
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

    #[Route('/translator', name: 'translator')]
    public function translator(): Response
    {
        return $this->render('default/translator.html.twig', [
            'currentPage' => 'translator',
        ]);
    }

    #[Route('/turbo', name: 'turbo')]
    public function turbo(): Response
    {
        return $this->render('default/turbo.html.twig', [
            'currentPage' => 'turbo',
        ]);
    }

    #[Route('/twig', name: 'twig')]
    public function twig(): Response
    {
        return $this->render('default/twig.html.twig', [
            'currentPage' => 'twig',
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
