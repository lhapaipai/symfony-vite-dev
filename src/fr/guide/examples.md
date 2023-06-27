# Exemples

Le dépôt [lhapaipai/symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) contient un dossier `playground` regroupant des exemples d'utilisation.

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

## Installation de l'exemple `basic`

C'est l'exemple qui présente la majorité des cas d'usage.

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
