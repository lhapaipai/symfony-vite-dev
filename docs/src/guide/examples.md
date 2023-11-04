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


## Install vite-bundle/vite-plugin-symfony dependencies
make install


## Install playgrounds (npm i/composer i for each of them)
make install-playgrounds

# launch the development environment for the `basic` playground.
cd playground/basic
symfony local:server:start
npm run dev
# from your browser go to: https://127.0.0.1:8000/
```
