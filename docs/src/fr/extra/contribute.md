# Contribuez

Le dépôt [lhapaipai/symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) regroupe dans un dossier tous les outils pour participer au développement.
Sous forme de sous-modules git vous aurez accès dans le dossier `extra` à la documentation, au bundle Symfony et au plugin Vite. Le dossier `playground` quant à lui regroupe des environnements de test pour couvrir l'ensemble des cas d'usage.

les dépendences npm sont gérés à la racine afin d'avoir les mêmes dépendances pour tous les exemples (et un seul dossier node_modules).
les dépendences composer des exemples sont quant à elles installées dans chaque dossier `playground/basic`, `playground/legacy`, etc... car je n'ai pas trouvé de moyen propre de faire cela. (le dossier `vendor` contient également le chemin vers les autoload propres à chaque exemple je ne pouvait donc pas partager ce dossier. si vous avez une solution je suis preneur)

```
.
├── extra
│   ├── symfony-vite-docs
│   ├── vite-bundle
│   └── vite-plugin-symfony
├── node_modules
│   ├── acorn
│   ├── ...
│   └── yocto-queue
├── package.json
├── package-lock.json
├── phpcs.phar
├── playground
│   ├── basic
│   ├── legacy
│   ├── multiple
│   ├── ssr
│   └── vite-only
├── README.md
└── shared
    └── theme
```

## Installation


```bash
git clone https://github.com/lhapaipai/symfony-vite-dev.git
cd symfony-vite-dev
git submodule init
git submodule update

# installer vite-plugin-symfony en local
# allons dans le dossier <project-dir>/extra/vite-plugin-symfony
cd extra/vite-plugin-symfony
npm i
npm run build
cd ../..

# installer les dépendances communes à tous les exemples
# dans le dossier <project-dir>
npm install

# installer les dépendances composer pour l'exemple `basic`.
cd playground/basic
composer install

# lancer l'environnement de développement pour l'exemple `basic`.
# toujours dans le dossier <project-dir>/playground/basic
npm run dev
symfony local:server:start

# depuis votre navigateur rendez-vous sur : https://127.0.0.1:8000/
```
