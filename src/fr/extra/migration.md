# Migration

## v4.x vers v5.x

Veuillez à mettre à jour votre Bundle `pentatrion/vite-bundle` à la version 5.x avec composer mais aussi votre paquet node `vite-plugin-symfony` vers une version 5.x.

Si vous utilisez la fonction twig `vite_mode`, les 3 valeurs possibles sont désormais : `"dev"` | `"build"` | `null`.

C'est terminé !

## Migration Vite-Bundle de la v0.2.x à la v1.x

Dans la version v0.2.x, vous devez spécifier vos points d'entrée dans un tableau dans votre fichier `vite.config.js`. dans v1.x, vous devez spécifier vos points d'entrée dans un objet.

```diff
-input: ["./assets/app.js"],
+input: {
+  app: "./assets/app.js"
+},
```

de cette façon, vous devez spécifier le point d'entrée nommé dans vos fonctions twig.

```diff
-{{ vite_entry_script_tags('app.js') }}
+{{ vite_entry_script_tags('app') }}
-{{ vite_entry_link_tags('app.js') }}
+{{ vite_entry_link_tags('app') }}
```

Dans la v1.x, votre symfonyPlugin est une **fonction** et provient du paquet `vite-plugin-symfony`.

```diff
+ import symfonyPlugin from 'vite-plugin-symfony';

    // ...
    plugins: [
-       symfonyPlugin,
+       symfonyPlugin(),
    ],
```
