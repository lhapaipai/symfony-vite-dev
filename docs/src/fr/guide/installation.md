# Pré-requis

Afin de tester l'implémentation, vous devez avoir une application Symfony avec au moins le bundle Twig installé.

```bash
symfony new symphonie-app

cd symphonie-app
composer install

composer require symfony/twig-bundle
composer require --dev symfony/maker-bundle

./bin/console make:controller
# Choose a name for your controller class (e.g. FierceElephantController):
# > WelcomeController
```

# Installation

Si votre application Symfony utilise actuellement le bundle Webpack Encore, consultez la documentation de [migration](/fr/extra/migration-webpack-encore) avant de commencer.


Installez le bundle et la recette associée :

```bash
composer require pentatrion/vite-bundle
# Review the recipe at https://github.com/symfony/recipes-contrib/tree/main/pentatrion/vite-bundle/1.0
# Do you want to execute this recipe?
# [y] Yes
# (defaults to n): y
```

Si vous avez déjà un `package.json` dans votre projet avant l'installation du bundle, la recette aura conservé votre fichier sans le modifier, vous devrez donc le mettre à jour en vous référant au fichier [package.json](https://github.com/lhapaipai/vite-bundle/blob/main/install/package.json) de référence (sections `scripts` et `devDependencies`).

```bash
#  installez vos dépendances js (vite et vite-plugin-symfony)
npm install

```

Add this twig functions in any template or base layout where you need to include a JavaScript entry.

```twig
{% block stylesheets %}
    {{ vite_entry_link_tags('app') }}
{% endblock %}

{% block javascripts %}
    {{ vite_entry_script_tags('app') }}
{% endblock %}
```

# Utilisation dans un environnement de développement

```bash
# démarrez votre serveur Web local Symfony (port d'écoute 8000 par défaut)
symfony serve

#  démarrez votre serveur de développement Vite (port d'écoute 5173 par défaut)
npm run dev
```

Vous pouvez vous rendre sur : `https://127.0.0.1:8000/welcome`.

Ouvrez votre console d'outils de développement, vous verrez : `Happy coding !!`.

# Utilisation en environnement de production

```bash
# générez vos fichiers js/css.
npm run build
```

Vous pouvez vous rendre sur : `https://<votre-domaine>/welcome`.



