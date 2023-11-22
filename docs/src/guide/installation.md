✨ Easy installation with Symfony Flex recipe.

<img src="/animations/install.svg" width="688" height="379" alt="installation" />

## Prerequisites

In order to test the implementation you must have a Symfony application with at least the Twig bundle installed.


```bash
symfony new symfony-app

cd symfony-app
composer install

composer require symfony/twig-bundle
composer require --dev symfony/maker-bundle

./bin/console make:controller
# Choose a name for your controller class (e.g. FierceElephantController):
# > WelcomeController
```

## Installation

If you come from Webpack Encore, check the [migration](/extra/migration-webpack-encore) documentation before starting.

Install the bundle and the recipe associated :

```bash
composer require pentatrion/vite-bundle
# Review the recipe at https://github.com/symfony/recipes-contrib/tree/main/pentatrion/vite-bundle/1.0
# Do you want to execute this recipe?
# [y] Yes
# (defaults to n): y
```

if you already have a `package.json` in your project before the installation of the bundle, the recipe will have kept your file without modifying it, so you will need to update it by referring to the [package.json](https://github.com/lhapaipai/vite-bundle/blob/main/install/package.json) reference file (sections `scripts` and `devDependencies`).

```bash
# install your js dependencies (vite and vite-plugin-symfony)
npm install

```

Add these Twig functions in any template or base layout where you need to include a style sheet or JavaScript entry.

```twig
{# base.html.twig #}
{% block stylesheets %}
    {{ vite_entry_link_tags('app') }}
{% endblock %}

{% block javascripts %}
    {{ vite_entry_script_tags('app') }}
{% endblock %}
```

## 💻 Usage in development environment

```bash
# start your Symfony local Web server (listening port 8000 by default)
symfony serve

# start your vite dev server (listening port 5173 by default)
npm run dev
```

You can go to: `https://127.0.0.1:8000/welcome`.

Open your developer tools console you'll see : `Happy coding !!`.

## 📦 Usage in production environment

```bash
# build your js/css files
npm run build
```

You can go to: `https://<your-domain>/welcome`.



