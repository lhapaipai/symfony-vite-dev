# Compatibility

In order to facilitate the versioning between the symfony bundle and the vite plugin, I decided since the version 3.3.0 to synchronize the major and minor version of the two packages. For the patch number, each package increments independently based on the respective bug fixes. There are therefore no correlations between patch versions and the most up-to-date version should always be used.

If you have no particular constraints, update the `pentatrion/vite-bundle` bundle to its latest version you will benefit from the maximum functionality (go to the page [migration](/fr/extra/migration)).

Else, if you want to stay on a fixed major version of the bundle.

```bash
composer update

# get major and minor version number
composer info pentatrion/vite-bundle

#  update your npm package accordingly
npm i vite-plugin-symfony@~X.Y
```


| Symfony                            | Vite                  | pentatrion/vite-bundle | vite-plugin-symfony |
|------------------------------------|-----------------------|------------------------|---------------------|
| ^4.4 \|\| ^5.0 \|\| ^6.0           | 3.x                   | 2.x                    | 0.6.0 - 0.7.1       |
| ^4.4 \|\| ^5.0 \|\| ^6.0           | 4.x                   | \>=3.0.x \<3.3.0       | ~0.7.2              |
| ^4.4 \|\| ^5.0 \|\| ^6.0           | 4.x                   | 3.3.x                  | 3.3.x               |
| ^4.4 \|\| ^5.0 \|\| ^6.0           | 4.x                   | 4.x.x                  | 4.x.x               |
| ^4.4 \|\| ^5.0 \|\| ^6.0           | 4.x                   | 5.x.x                  | 5.x.x               |
| ^4.4 \|\| ^5.0 \|\| ^6.0 \|\| ^7.0 | 4.x                   | \>=6.0.x \<6.2.x       | \>=6.0.x \<6.2.x    |
| ^4.4 \|\| ^5.0 \|\| ^6.0 \|\| ^7.0 | 4.x \|\| 5.x          | \>=6.2.x               | \>=6.2.x            |
| ^4.4 \|\| ^5.0 \|\| ^6.0 \|\| ^7.0 | 4.x \|\| 5.x \|\| 6.x | 7.x                    | 7.x                 |



