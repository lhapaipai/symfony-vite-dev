# Migration

## from v4.x to v5.x

Please update your Bundle `pentatrion/vite-bundle` to version 5.x with composer but also your node package `vite-plugin-symfony` to 5.x.

If you use the `vite_mode` twig function, the 3 possible values are now: `"dev"` | `"build"` | `null`.

It's over !

## Vite-Bundle migration from v0.2.x to v1.x

In version v0.2.x, you have to specify your entry points in an array in your `vite.config.js` file. in v1.x you need to specify your entry points in an object.

```diff
-input: ["./assets/app.js"],
+input: {
+  app: "./assets/app.js"
+},
```

this way you need to specify the named entry point in your twig functions.

```diff
-{{ vite_entry_script_tags('app.js') }}
+{{ vite_entry_script_tags('app') }}
-{{ vite_entry_link_tags('app.js') }}
+{{ vite_entry_link_tags('app') }}
```

In v1.x, your symfonyPlugin is a **function** and come from the `vite-plugin-symfony` package.

```diff
+ import symfonyPlugin from 'vite-plugin-symfony';

    // ...
    plugins: [
-       symfonyPlugin,
+       symfonyPlugin(),
    ],
```
