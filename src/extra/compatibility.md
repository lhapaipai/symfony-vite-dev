# Compatibility

In order to facilitate the versionning between the symfony bundle and the vite plugin, I decided since the version 3.3.0 to synchronize the major and minor version of the two packages. For the patch number, each package increments independently based on the respective bug fixes. There are therefore no correlations between patch versions and the most up-to-date version should always be used.

| Symfony                  | Vite | pentatrion/vite-bundle | vite-plugin-symfony |
|--------------------------|------|------------------------|---------------------|
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 3.x  | 2.x                    | 0.6.0 - 0.7.1       |
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 4.x  | \>=3.0.x \<3.3.0       | ~0.7.2              |
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 4.x  | 3.3.x                  | 3.3.x               |
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 4.x  | 4.0.x                  | 4.0.x               |


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
