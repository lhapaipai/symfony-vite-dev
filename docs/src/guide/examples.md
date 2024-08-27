# Examples ⛳

The [lhapaipai/symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) repository contains a `playground` directory with usage examples.

```
.
├── src
│ ├── vite-bundle
│ └── vite-plugin-symfony
├── node_modules
│ ├── acorn
│ ├── ...
│ └── yocto-tail
├── package.json
├── package-lock.json
├── phpcs.phar
├── playground
│ ├── basic
│ ├── legacy
│ ├── multiple
│ ├── ssr
│ └── fast-only
├── README.md
└── shared
     └── theme
```

## Installation of the `basic` example

This is the example that presents the majority of use cases.

```bash
git clone https://github.com/lhapaipai/symfony-vite-dev.git
cd symfony-vite-dev

## Install vite-bundle/vite-plugin-symfony dependencies
make install

# if you want to test the features in one playground
# - "basic" is the principal playground
# - "stimulus-basic" is for the core feature of stimulus
# - "stimulus" is for Symfony UX
# - other playgrounds are for specific use cases

cd playground/<your-playground>
symfony composer install


# launch the development environment for the `basic` playground.
symfony local:server:start
npm run dev
# from your browser go to: https://127.0.0.1:8000/

# if you want to install all the playgrounds in one time (for each of them)
# - composer install
# - pnpm run build
make install-playgrounds
```
