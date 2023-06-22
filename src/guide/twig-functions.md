# Twig functions

The bundle provide 2 twig functions both of which accept an optional second parameter of options.
An optional third parameter `buildName` si available if you have multiple builds. Look at [multiple configurations](/guide/multiple-configurations) page if you want more details.

## vite_entry_script_tags

arguments details:
- `<entryName>` **type: string** Name of your entrypoint defined in your `vite.config.js` file.
- `options` (optionnal) **type: associative array**
  - dependency **type: `"react"` | `null`** if your code use ReactJS, you need to specify this dependency to allow Vite to be able to modify the HTML during development. [More details on Vite documentation](https://vitejs.dev/guide/backend-integration.html#backend-integration)
  - attr: Array (an associative array of extra attributes)
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
  - attr: Array (an associative array of extra attributes)
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
