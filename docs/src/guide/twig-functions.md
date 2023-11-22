# Twig functions <img src="/images/logo-twig.svg" width="32" height="23" style="display: inline; vertical-align: -10%; " />

The bundle provides two Twig functions both of which accept an optional second parameter of options.
An optional third parameter `config_name` is available if you have multiple builds. Look at [multiple configurations](/guide/multiple-configurations) page if you want more details.

## vite_entry_script_tags 📜

arguments details:
- `<entry_name>` **type: string** Name of your entrypoint defined in your `vite.config.js` file.
- `options` (optionnal) **type: associative array**
  - `dependency` **type: `"react"` | `null`** if your code use ReactJS, you need to specify this dependency to allow Vite to be able to modify the HTML during development. [More details on Vite documentation](https://vitejs.dev/guide/backend-integration.html#backend-integration)
  - `attr`: Array (an associative array of extra attributes).
  - `absolute_url`: **type: `boolean`** Generates full URLs of your js files
- `config_name` (optionnal) **type: string** leave empty if you have only one `vite.config.js` file, else `default_config` if not specified.

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

arguments details:
- `<entry_name>` **type: string** Name of your entrypoint defined in your `vite.config.js` file.
- `options` (optionnal) **type: associative array**
  - `attr`: Array (an associative array of extra attributes).
  - `preloadDynamicImports`: **type: boolean, default: false** Preload dynamic imports in `<link rel="modulepreload">` tags.
  - `absolute_url`: **type: `boolean`** Generates full URLs of your css files
- `config_name` (optionnal) **type: string** leave empty if you have only one `vite.config.js` file, else `default_config` if not specified.


```twig
{{ vite_entry_link_tags(
  '<entry_name>',
  {
    attr: {
        media: "screen and (prefers-color-scheme: dark)"
    }
  },
  '<custom_build_name_1>'
) }}
```

## vite_mode

Some plugins require knowing if the development server is running to run scripts. This function solves this problem.

arguments details:
- `config_name` (optionnal) **type: string** leave empty if you have only one `vite.config.js` file, else `default_config` if not specified.

return value : `"dev"` | `"build"` | `null`

```twig
{{ vite_mode('<custom_build_name_1>') }}
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
