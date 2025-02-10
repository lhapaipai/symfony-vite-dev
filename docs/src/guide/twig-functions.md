# Twig functions <img src="/images/logo-twig.svg" width="32" height="23" style="display: inline; vertical-align: -10%; " />

The bundle provides two Twig functions, both of which accept an optional second parameter of options.
An optional third parameter `config_name` is available if you have multiple builds. Look at [multiple configurations](/guide/multiple-configurations) page for more details.

These functions render in your Twig templates the `<script>` or `<style>` tags associated with your entry points. Depending on the context (development, production, legacy) some additional internal tags will be automatically included (adding the Vite client, adding `polyfills`).

::: warning
The additional attributes that you can define in the options will not be associated with the internal tags. If you want to add specific attributes to your internal tags (e.g. `nonce`), you can do so by subscribing to the `RenderAssetTagEvent` event (see [Custom attributes](/guide/custom-attributes.html#subscribe-to-renderassettagevent-%F0%9F%A7%A9)).
:::

## vite_entry_script_tags 📜

arguments details:
- `<entry_name>` **type: string** Name of your entrypoint defined in your `vite.config.js` file.
- `options` (optional) **type: associative array**
  - `dependency` **type: `"react"` | `null`** if your code use ReactJS, you need to specify this dependency to allow Vite to be able to modify the HTML during development. [More details on Vite documentation](https://vitejs.dev/guide/backend-integration.html#backend-integration)
  - `attr`: Array (an associative array of extra attributes).
  - `absolute_url`: **type: `boolean`** Generates full URLs of your js files
- `config_name` (optional) **type: string** leave empty if you have only one `vite.config.js` file, else `default_config` if not specified.

```twig
{{ vite_entry_script_tags(
  '<entry_name>',
  {
    dependency: 'react',
    attr: {
        referrerpolicy: "origin"
    }
  },
  '<custom-config-name-1>'
) }}
```


## vite_entry_link_tags 🎨

arguments details:
- `<entry_name>` **type: string** Name of your entrypoint defined in your `vite.config.js` file.
- `options` (optional) **type: associative array**
  - `attr`: Array (an associative array of extra attributes).
  - `preloadDynamicImports`: **type: boolean, default: false** Preload dynamic imports in `<link rel="modulepreload">` tags.
  - `absolute_url`: **type: `boolean`** Generates full URLs of your css files
- `config_name` (optional) **type: string** leave empty if you have only one `vite.config.js` file, else `default_config` if not specified.


```twig
{{ vite_entry_link_tags(
  '<entry_name>',
  {
    attr: {
        media: "screen and (prefers-color-scheme: dark)"
    }
  },
  '<custom-config-name-1>'
) }}
```

## vite_mode

Some plugins require knowing if the development server is running to run scripts. This function solves this problem.

arguments details:
- `config_name` (optional) **type: string** leave empty if you have only one `vite.config.js` file, else `default_config` if not specified.

return value : `"dev"` | `"build"` | `null`

```twig
{{ vite_mode('<custom-config-name-1>') }}
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
