<p align="center">
  <img width="100" src="https://raw.githubusercontent.com/lhapaipai/vite-bundle/main/docs/symfony-vite.svg" alt="Symfony logo">
</p>

# Symfony Vite Development Repository

In this repository you can contribute to `pentatrion/vite-bundle` et `vite-plugin-symfony`. You can find playgrounds for development.

## Installation


```bash
git clone https://github.com/lhapaipai/symfony-vite-dev.git
cd symfony-vite-dev


## Install vite-bundle/vite-plugin-symfony dependencies
make install


## Install playgrounds (npm i/composer i for each of them)
make install-playgrounds
```

## Execution

```bash
# launch the development environment for the `basic` playground.
cd playground/basic
symfony local:server:start
npm run dev
# from your browser go to: https://127.0.0.1:8000/
```


## Ecosystem

| Package                                                                 | Description                    |
| ----------------------------------------------------------------------- | :---------------------------   |
| [vite-bundle](https://github.com/lhapaipai/vite-bundle)                 | Symfony Bundle (subtree split) |
| [vite-plugin-symfony](https://github.com/lhapaipai/vite-plugin-symfony) | Vite plugin    (subtree split) |

## License

[MIT](LICENSE).