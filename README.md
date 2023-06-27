<p align="center">
  <img width="100" src="https://raw.githubusercontent.com/lhapaipai/vite-bundle/main/docs/symfony-vite.svg" alt="Symfony logo">
</p>

# Symfony Vite Development Repository

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


## Ecosystem

| Package                                                                 | Description               |
| ----------------------------------------------------------------------- | :------------------------ |
| [vite-bundle](https://github.com/lhapaipai/vite-bundle)                 | Symfony Bundle            |
| [vite-plugin-symfony](https://github.com/lhapaipai/vite-plugin-symfony) | Vite plugin               |
| [symfony-vite-docs](https://github.com/lhapaipai/symfony-vite-docs)     | Documentation             |
| [symfony-vite-dev](https://github.com/lhapaipai/symfony-vite-dev)       | Package for contributors  |

## License

[MIT](LICENSE).