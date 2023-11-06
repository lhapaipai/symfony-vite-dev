# Contribute

The repository [lhapaipai/symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev) brings together in a folder all the tools to participate in development.
You will have access to the Symfony bundle and the Vite plugin in the `src` folder. The `playground` folder groups together test environments to cover all use cases.

npm dependencies are managed at the root in order to have the same dependencies for all examples (and a single node_modules folder).
the composer examples dependencies are installed in each folder `playground/basic`, `playground/legacy`, etc... because I haven't found a clean way to do that. (the `vendor` folder also contains the path to the autoloads specific to each example so I could not share this folder. if you have another solution let me know)

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
