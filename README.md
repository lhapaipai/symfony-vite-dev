<div>
  <p align="center">
  <img width="100" src="https://raw.githubusercontent.com/lhapaipai/vite-bundle/main/docs/symfony-vite.svg" alt="Symfony logo">
  </p>
  <p align="center">
    <img src="https://img.shields.io/npm/v/vite-plugin-symfony?style=flat-square&logo=npm">
    <img src="https://img.shields.io/packagist/v/pentatrion/vite-bundle?style=flat-square&logo=packagist">
    <img src="https://img.shields.io/github/actions/workflow/status/lhapaipai/symfony-vite-dev/vite-plugin-symfony-ci.yml?style=flat-square&label=vite-plugin-symfony%20CI&logo=github">
    <img src="https://img.shields.io/github/actions/workflow/status/lhapaipai/symfony-vite-dev/vite-bundle-ci.yml?style=flat-square&label=vite-bundle%20CI&logo=github">

  </p>
</div>



# Symfony Vite Development Repository

In this repository you can contribute to `pentatrion/vite-bundle` and `vite-plugin-symfony`. You can find playgrounds for development.

## Installation


```console
git clone https://github.com/lhapaipai/symfony-vite-dev.git
cd symfony-vite-dev

# Install vite-bundle/vite-plugin-symfony dependencies
make install

# if you want to test the features in a playground
# - "basic" is the principal playground
# - "stimulus-basic" is for the core feature of stimulus
# - "stimulus" is for Symfony UX
# - other playgrounds are for specific use cases

cd playground/<your-playground>
symfony composer install


# if you want to install all the playgrounds in one time (for each of them)
# - composer install
# - pnpm run build
make install-playgrounds
```



## Execution

```console
# launch the development environment for the `basic` playground.
cd playground/basic
symfony local:server:start
pnpm run dev
# from your browser go to: https://127.0.0.1:8000/
```


## Ecosystem

| Package                                                                 | Description                    |
| ----------------------------------------------------------------------- | :---------------------------   |
| [vite-bundle](https://github.com/lhapaipai/vite-bundle)                 | Symfony Bundle (subtree split) |
| [vite-plugin-symfony](https://github.com/lhapaipai/vite-plugin-symfony) | Vite plugin    (subtree split) |

## License

[MIT](LICENSE).
