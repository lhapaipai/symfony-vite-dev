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

## Installation des dépendances principales vite-bundle/vite-plugin-symfony
make install

# si vous souhaitez tester un exemple en particulier
# - "basic" exemple principal
# - "stimulus-basic" pour stimulus seul
# - "stimulus" pour stimulus couplé avec Symfony UX
# - les autres exemples sont pour des cas spécifiques

cd playground/<your-playground>
symfony composer install

# démarrage de l'environnement de développement.
symfony local:server:start
npm run dev
# depuis votre navigateur rendez-vous sur : https://127.0.0.1:8000/

# si vous souhaitez installer tous les exemples en une fois
# - composer install
# - pnpm run build
make install-playgrounds
```
