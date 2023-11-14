# Stimulus : En profondeur

Afin de faciliter l'intégration de Stimulus dans les applications Symfony, ce dernier a créé un bundle spécifique `symfony/stimulus-bundle`. Ce bundle ajoute :

- des fonctions et filtres Twig pour générer facilement des attributs `data-*`
- des services pour créer des `data-*` attributs compatible Stimulus et les utiliser dans vos propres services.
- un système de chargement automatique et paresseux des controlleurs Stimulus via un paquet npm `@symfony/stimulus-bridge` lié au bundle. Ce dernier va analyser
  - le fichier `assets/controllers.json` pour vos contrôleurs tiers
  - les contrôleurs stockés dans un dossier `assets/controllers`
et renverra du code pour que l'application Stimulus se précharge automatiquement

Par dessus cela Symfony a construit tout un éco-système `Symfony UX` basé sur des bundles qui intègrent chacun d'eux des contrôleurs `Stimulus`.

Le paquet npm `@symfony/stimulus-bridge` n'étant pas compatible avec Vite:
  - utilisation de `require.context`
  - utilisation de loaders `webpack`

le plugin `vite-plugin-symfony` vient ici en remplacement de `@symfony/stimulus-bridge` et assure le pont entre `symfony/stimulus-bundle`, `Symfony UX` et `Vite`.

