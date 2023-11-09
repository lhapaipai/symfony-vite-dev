<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;

class TimeForAMealFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
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
        ;
    }
}
