# Contribuez

Le dépôt [lhapaipai/symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) regroupe dans un dossier tous les outils pour participer au développement.
Vous aurez accès dans le dossier `src` au bundle Symfony et au plugin Vite. Le dossier `playground` quant à lui regroupe des environnements de test pour couvrir l'ensemble des cas d'usage.

les dépendances npm sont gérées à la racine afin d'avoir les mêmes dépendances pour tous les exemples (et un seul dossier node_modules).
les dépendances composer des exemples sont quant à elles installées dans chaque dossier `playground/basic`, `playground/legacy`, etc... car je n'ai pas trouvé de moyen propre de faire cela. (le dossier `vendor` contient également le chemin vers les autoload propres à chaque exemple je ne pouvais donc pas partager ce dossier. si vous avez une autre solution faites le moi savoir)

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


## Install vite-bundle/vite-plugin-symfony dependencies
make install


## Install playgrounds (npm i/composer i for each of them)
make install-playgrounds

# launch the development environment for the `basic` playground.
cd playground/basic
symfony local:server:start
npm run dev

# depuis votre navigateur rendez-vous sur : https://127.0.0.1:8000/
```
