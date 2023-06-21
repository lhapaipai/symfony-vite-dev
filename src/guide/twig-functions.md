# Twig functions

The bundle provide 2 twig functions both of which accept an optional second parameter of options and an optional third parameter `buildName` if you have multiple builds (look at [#multiple vite configurations](#multiple-vite-configurations) section).

`vite_entry_script_tags`

options:
- dependency: 'react' | null
- attr: Array (an array of extra attributes)

```twig
vite_entry_script_tags('<entrypoint>', {
    dependency: 'react',
    attr: {
        referrerpolicy: "origin"
    }
})
```

`vite_entry_link_tags`

options:
- attr: Array (an array of extra attributes)

```twig
vite_entry_link_tags('<entrypoint>', {
    attr: {
        media: "screen and (prefers-color-scheme: dark)"
    }
})
```

if you have defined multiple builds
```twig
vite_entry_script_tags('<entrypoint>', {}, '<custom-build-name-1>')
```
