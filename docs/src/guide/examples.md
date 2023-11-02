# Examples

The [lhapaipai/symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) repository contains a `playground` directory with usage examples.

```
.
├── extra
│ ├── symfony-vite-docs
│ ├── fast-bundle
│ └── fast-plugin-symfony
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
git submodule init
git submodule update

# install vite-plugin-symfony locally
# go to the folder <project-dir>/extra/vite-plugin-symfony
cd extra/vite-plugin-symfony
npm i
npm run build
cd ../..

# install common dependencies to all examples
# in the <project-dir> folder
npm install

# install composer dependencies for the `basic` example.
cd playground/basic
composer install

# launch the development environment for the `basic` example.
# always in the <project-dir>/playground/basic folder
npm run dev
symfony local:server:start

# from your browser go to: https://127.0.0.1:8000/
```
