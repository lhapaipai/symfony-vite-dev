# Vite plugin Symfony Options

## publicDirectory

- **Type :** `string`
- **Valeur par défaut :** `public`

Chemin relatif depuis le dossier racine de votre projet vers le dossier public de votre serveur web. Dans certains cas il peut s'agir de `www` ou `public_html`.

::: warning
Si vous définissez les options `publicDirectory` et `buildDirectory` de l'extension vous n'avez pas besoin de définir les options `base` et `build.outDir` de Vite.
:::

## buildDirectory

- **Type :** `string`
- **Valeur par défaut :** `public`

Chemin relatif depuis votre dossier public dans lequel ont été compilés vos fichiers à la suite d'un `vite build`.

::: warning
Voir remarque plus haut.
:::

## servePublic

- **Type :** `boolean`
- **Valeur par défaut :** `true`

Par défaut l'extension désactive l'option `publicDir` de la configuration de vite. Nous ne souhaitons pas que le contenu complet du dossier public (point d'entrée index.php, etc...) soit copié dans le dossier de build. (voir [discussion](https://github.com/lhapaipai/vite-bundle/issues/17)). En activant cette option l'extension active tout de même un serveur local pour que le serveur de développement de Vite puisse renvoyer les fichiers présents dans le dossier public.

Si vous souhaitez tout de même utiliser l'option `publicDir` de vite, désactivez d'abord cette option.

::: tip
Cette option sera supprimée dès que l'option `build.copyPublicDir` de Vite sera définitivement adoptée.
:::

## refresh

- **Type :** `boolean | string[]`
- **Valeur par défaut :** `false`

Permet de relancer le serveur de développement de Vite lorsque vos fichiers sont modifiés. En mettant cette valeur à `true`, le serveur vérifiera les modifications sur vos fichiers Twig (équivalent à la valeur `["templates/**/*.twig"]`). Vous pouvez également définir votre propre tableau de motif.

Vite utilise la librairie [picomatch](https://github.com/micromatch/picomatch) pour interpréter les motifs.

## viteDevServerHostname

- **Type :** `null | string`
- **Valeur par défaut :** `null`

Si vous avez spécifié l'option Vite `server.host` à `0.0.0.0` (pour Docker notamment) vous aurez probablement besoin de configurer `viteDevServerHostname` à 'localhost'. Voir [discussion](https://github.com/lhapaipai/vite-bundle/issues/26).

## debug

- **Type :** `boolean`
- **Valeur par défaut :** `false`

Affiche dans la console la configuration complète de Vite lorsqu'elle a été complètement résolue (`configResolved`).

