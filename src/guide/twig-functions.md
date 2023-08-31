# Twig functions

The bundle provide 2 twig functions both of which accept an optional second parameter of options.
An optional third parameter `buildName` si available if you have multiple builds. Look at [multiple configurations](/guide/multiple-configurations) page if you want more details.

## vite_entry_script_tags

arguments details:
- `<entryName>` **type: string** Name of your entrypoint defined in your `vite.config.js` file.
- `options` (optionnal) **type: associative array**
  - `dependency` **type: `"react"` | `null`** if your code use ReactJS, you need to specify this dependency to allow Vite to be able to modify the HTML during development. [More details on Vite documentation](https://vitejs.dev/guide/backend-integration.html#backend-integration)
  - `attr`: Array (an associative array of extra attributes).
- `buildName` (optionnal) **type: string** leave empty if you have only one `vite.config.js` file, else `default_build` if not specified.

```twig
{{ vite_entry_script_tags(
  '<entrypoint>',
  {
    dependency: 'react',
    attr: {
        referrerpolicy: "origin"
    }
  }
) }}
```


## vite_entry_link_tags

arguments details:
- `<entryName>` **type: string** Name of your entrypoint defined in your `vite.config.js` file.
- `options` (optionnal) **type: associative array**
  - `attr`: Array (an associative array of extra attributes).
  - `preloadDynamicImports`: **type: boolean, default: false** Preload dynamic imports in `<link rel="modulepreload">` tags.
- `buildName` (optionnal) **type: string** leave empty if you have only one `vite.config.js` file, else `default_build` if not specified.


```twig
{{ vite_entry_link_tags(
  '<entrypoint>',
  {
    attr: {
        media: "screen and (prefers-color-scheme: dark)"
    }
  },
  '<custom-build-name-1>'
) }}
```

## vite_mode

Some plugins require knowing if the development server is running to run scripts. This function solves this problem.

arguments details:
- `buildName` (optionnal) **type: string** leave empty if you have only one `vite.config.js` file, else `default_build` if not specified.

return value : `"dev"` | `"prod"` | `null`

```twig
{{ vite_mode('<custom-build-name-1>') }}
```

example:
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
