# Exemples ⛳

Le dépôt de développement [lhapaipai/symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) contient un dossier `playground` regroupant des exemples d'utilisation.

```
.
├── src
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

## Install vite-bundle/vite-plugin-symfony dependencies
make install

## Install playgrounds (npm i/composer i for each of them)
make install-playgrounds

# Tester l'exemple basic
cd playground/basic
symfony local:server:start
npm run dev
# depuis votre navigateur rendez-vous sur : https://127.0.0.1:8000/
```
