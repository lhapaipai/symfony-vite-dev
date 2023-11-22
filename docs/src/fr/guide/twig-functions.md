# Fonctions Twig <img src="/images/logo-twig.svg" width="32" height="23" style="display: inline; vertical-align: -10%; " />

Le bundle fournit 2 fonctions Twig qui acceptent toutes deux un deuxième paramètre optionnel d'options.
Un troisième paramètre optionnel "config_name" est disponible si vous avez plusieurs builds. Regardez la page [configurations multiples](/fr/guide/multiple-configurations) si vous voulez plus de détails.

## vite_entry_script_tags 📜

détails des arguments :
- `<entry_name>` **type: string** Nom de votre point d'entrée défini dans votre fichier `vite.config.js`.
- `options` (optionnel) **type: associative array**
  - `dependency` **type: `"react"` | `null`**  si votre code utilise ReactJS, vous devez spécifier cette dépendance pour permettre à Vite de pouvoir modifier le HTML pendant le développement. [Plus de détails sur la documentation de Vite](https://vitejs.dev/guide/backend-integration.html#backend-integration)
  - `attr`: Array (un tableau associatif d'attributs supplémentaires).
  - `absolute_url`: **type: `boolean`** Génère des URL complètes de vos fichiers js
- `config_name` (optionnel) **type: string** laissez vide si vous n'avez qu'un seul fichier `vite.config.js`, sinon `default_config` si non spécifié.

```twig
{{ vite_entry_script_tags(
  '<entry_name>',
  {
    dependency: 'react',
    attr: {
        referrerpolicy: "origin"
    }
  }
) }}
```


## vite_entry_link_tags 🎨

détails des arguments :- `<entry_name>` **type: string** Name of your entrypoint defined in your `vite.config.js` file.
- `<entry_name>` **type: string** Nom de votre point d'entrée défini dans votre fichier `vite.config.js`.
- `options` (optionnel) **type: associative array**
  - `attr`: Array (un tableau associatif d'attributs supplémentaires).
  - `preloadDynamicImports`: **type: boolean, default: false** Précharge dans des balises `<link rel="modulepreload">` les imports dynamiques.
  - `absolute_url`: **type: `boolean`** Génère des URL complètes de vos fichiers css

- `config_name` (optionnel) **type: string** laissez vide si vous n'avez qu'un seul fichier `vite.config.js`, sinon `default_config` si non spécifié.

```twig
{{ vite_entry_link_tags(
  '<entry_name>',
  {
    attr: {
        media: "screen and (prefers-color-scheme: dark)"
    }
  },
  '<custom-build-name-1>'
) }}
```

## vite_mode

Certains plugins nécessitent de savoir si le serveur de développement est lancé pour exécuter des scripts. cette fonction permet de résoudre cette problématique.

détails des arguments :
- `config_name` (optionnel) **type: string** laissez vide si vous n'avez qu'un seul fichier `vite.config.js`, sinon `default_config` si non spécifié.


valeur de retour : `"dev"` | `"build"` | `null`

```twig
{{ vite_mode('<custom-build-name-1>') }}
```

exemple :
```twig
{% block stylesheets %}
  {{ vite_entry_link_tags('app') }}
{% endblock %}

{% block javascripts %}
  {{ vite_entry_script_tags('app') }}
  {% if vite_mode() == 'dev' %}
    <script type="module" src="http://localhost:5173/@vite-plugin-checker-runtime-entry"></script>
  {% endif %}
{% endblock %}
```
