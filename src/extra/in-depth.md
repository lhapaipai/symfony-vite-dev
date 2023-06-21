# How this bundle works

```twig
{% block stylesheets %}
    {{ vite_entry_link_tags('app') }}
{% endblock %}

{% block javascripts %}
    {{ vite_entry_script_tags('app') }}
{% endblock %}
```

would render in dev:

```html
<!--Nothing with vite_entry_link_tags('app') -->

<!-- vite_entry_script_tags('app') -->
<script src="http://localhost:5173/build/@vite/client" type="module"></script>
<script src="http://localhost:5173/build/app.js" type="module"></script>
```

would render in prod:

```html
<!-- vite_entry_link_tags('app') -->
<link rel="stylesheet" href="/build/app.[hash].css" />
<link rel="modulepreload" href="/build/vendor.[hash].js" />

<!-- vite_entry_script_tags('app') -->
<script src="/build/app.[hash].js" type="module"></script>
```

In development environment, the bundle also acts as a proxy by forwarding requests that are not intended for it to the Vite dev server.

