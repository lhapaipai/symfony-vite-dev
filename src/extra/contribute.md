# Contribute

The repository [lhapaipai/symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) gathers in a folder all the tools to participate in the development.
In the form of git sub-modules you will have access in the `extra` folder to the documentation, the Symfony bundle and the Vite plugin. The `playground` folder includes test environments to cover all use cases.

npm dependencies are managed at the root in order to have the same dependencies for all examples (and a single node_modules folder).
the example composer dependencies are installed in each `playground/basic`, `playground/legacy`, etc... folder because I haven't found a clean way to do this. (the `vendor` folder also contains the path to the autoloads specific to each example so I could not share this folder. if you have a solution I am interested)

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

## Installation


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

# install dependencies common to all examples
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
