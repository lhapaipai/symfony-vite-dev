# Compatibility

In order to facilitate the versionning between the symfony bundle and the vite plugin, I decided since the version 3.3.0 to synchronize the major and minor version of the two packages. For the patch number, each package increments independently based on the respective bug fixes. There are therefore no correlations between patch versions and the most up-to-date version should always be used.

| Symfony                  | Vite | pentatrion/vite-bundle | vite-plugin-symfony |
|--------------------------|------|------------------------|---------------------|
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 3.x  | 2.x                    | 0.6.0 - 0.7.1       |
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 4.x  | \>=3.0.x \<3.3.0       | ~0.7.2              |
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 4.x  | 3.3.x                  | 3.3.x               |
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 4.x  | 4.0.x                  | 4.0.x               |
| ^4.4 \|\| ^5.0 \|\| ^6.0 | 4.x  | 5.0.x                  | 5.0.x               |


