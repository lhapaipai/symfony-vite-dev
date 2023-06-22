# Fonctions Twig

Le bundle fournit 2 fonctions twig qui acceptent toutes deux un deuxième paramètre optionnel d'options.
Un troisième paramètre optionnel "buildName" est disponible si vous avez plusieurs builds. Regardez la page [configurations multiples](/fr/guide/multiple-configurations) si vous voulez plus de détails.

## vite_entry_script_tags

détails des arguments :
- `<entryName>` **type: string** Nom de votre point d'entrée défini dans votre fichier `vite.config.js`.
- `options` (optionnel) **type: associative array**
  - dependency **type: `"react"` | `null`**  si votre code utilise ReactJS, vous devez spécifier cette dépendance pour permettre à Vite de pouvoir modifier le HTML pendant le développement. [Plus de détails sur la documentation de Vite](https://vitejs.dev/guide/backend-integration.html#backend-integration)
  - attr: Array (un tableau associatif d'attributs supplémentaires)
- `buildName` (optionnel) **type: string** laissez vide si vous n'avez qu'un seul fichier `vite.config.js`, sinon `default_build` si non spécifié.

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

détails des arguments :- `<entryName>` **type: string** Name of your entrypoint defined in your `vite.config.js` file.
- `<entryName>` **type: string** Nom de votre point d'entrée défini dans votre fichier `vite.config.js`.
- `options` (optionnel) **type: associative array**
  - attr: Array (un tableau associatif d'attributs supplémentaires)
- `buildName` (optionnel) **type: string** laissez vide si vous n'avez qu'un seul fichier `vite.config.js`, sinon `default_build` si non spécifié.

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
