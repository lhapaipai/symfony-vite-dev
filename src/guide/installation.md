# Installation

This bundle helping you render all of the dynamic `script` and `link` tags needed.
Essentially, he provides two twig functions to load the correct scripts into your templates.

Before you start, make sure you don't have a package.json file otherwise, or if you come from Webpack Encore, check the [migration](/extra/migration-webpack-encore) documentation.

Install the bundle with :

```bash
composer require pentatrion/vite-bundle
```

```bash
npm install

# start your vite dev server
npm run dev
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

if you are using React, you have to add this option in order to have FastRefresh.

```twig
{{ vite_entry_script_tags('app', { dependency: 'react' }) }}
```

