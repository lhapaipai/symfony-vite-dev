# Compatibility

In order to facilitate the versionning between the symfony bundle and the vite plugin, I decided since the version 3.3.0 to synchronize the major and minor version of the two packages. For the patch number each package increments independently.

| Symfony                  | Vite | pentatrion/vite-bundle | vite-plugin-symfony |
|--------------------------|------|------------------------|---------------------|
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 3.x  | 2.x                    | 0.6.0 - 0.7.1       |
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 4.x  | >=3.0.x <3.3.0         | ~0.7.2              |
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 4.x  | 3.3.x                  | 3.3.x               |


## Migration

This version 3 is compatible with Vite v4. For migration from v2.X to v3, you just need to update your `vite-plugin-symfony` package to version >= 0.7.2.

Vite-bundle version 2 is compatible with Vite v3.

If you use previous version of the plugin consult [migration](https://github.com/lhapaipai/vite-bundle/blob/main/docs/migration.md) page.
