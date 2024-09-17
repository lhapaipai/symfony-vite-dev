# Comment fonctionne ce bundle

```twig
{% block stylesheets %}
    {{ vite_entry_link_tags('app') }}
{% endblock %}

{% block javascripts %}
    {{ vite_entry_script_tags('app') }}
{% endblock %}
```

rendrait en développement:

```html
<!--Nothing with vite_entry_link_tags('app') -->

<!-- vite_entry_script_tags('app') -->
<script src="http://localhost:5173/build/@vite/client" type="module"></script>
<script src="http://localhost:5173/build/app.js" type="module"></script>
```

rendrait en production :

```html
<!-- vite_entry_link_tags('app') -->
<link rel="stylesheet" href="/build/app.[hash].css" />
<link rel="modulepreload" href="/build/vendor.[hash].js" />

<!-- vite_entry_script_tags('app') -->
<script src="/build/app.[hash].js" type="module"></script>
```

Dans un environnement de développement, le bundle agit également comme un proxy en transférant les requêtes qui ne lui sont pas destinées au serveur de développement Vite.
