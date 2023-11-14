<?php

namespace App\Twig\Components;

use Symfony\UX\LiveComponent\Attribute\AsLiveComponent;
use Symfony\UX\LiveComponent\Attribute\LiveProp;
use Symfony\UX\LiveComponent\DefaultActionTrait;

#[AsLiveComponent]
class TownSearch
{
    use DefaultActionTrait;

    #[LiveProp(writable: true)]
    public string $query = '';

    public const TOWNS = [
        'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice',
        'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille',
        'Rennes', 'Reims', 'Le Havre', 'Cannes', 'Grenoble',
        'Dijon', 'Angers', 'Nîmes', 'Aix-en-Provence', 'Saint-Étienne',
        'Clermont-Ferrand', 'Toulon', 'Le Mans', 'Amiens', 'Limoges',
        'Tours', 'Metz', 'Besançon', 'Perpignan', 'Orléans',
    ];

    public function getTowns(): array
    {
        $query = $this->query;

        return array_filter(self::TOWNS, function ($town) use ($query) {
            return str_starts_with(strtolower($town), strtolower($query));
        });
    }
}
