# Vite plugin Symfony Options

## debug

- **Type :** `boolean`
- **Valeur par défaut :** `false`

Affiche dans la console la configuration complète de Vite lorsqu'elle a été complètement résolue (`configResolved`).

## originOverride

- **Type:** `null | string`
- **Valeur par défaut:** `null`

Remplace l'origine pour les points d'entrée avec le serveur de développement. Utile lorsque vous utilisez un serveur proxy. Si vous avez spécifié l'option Vite `server.host` à `0.0.0.0` (pour Docker notamment) vous aurez probablement besoin de configurer `viteDevServerHostname` à `http://localhost`.

## refresh

- **Type :** `boolean | string[]`
- **Valeur par défaut :** `false`

Permet de relancer le serveur de développement de Vite lorsque vos fichiers sont modifiés. En mettant cette valeur à `true`, le serveur vérifiera les modifications sur vos fichiers Twig (équivalent à la valeur `["templates/**/*.twig"]`). Vous pouvez également définir votre propre tableau de motif.

Vite utilise la librairie [picomatch](https://github.com/micromatch/picomatch) pour interpréter les motifs.

## servePublic

- **Type :** `boolean`
- **Valeur par défaut :** `true`

Par défaut l'extension désactive l'option `publicDir` de la configuration de vite. Nous ne souhaitons pas que le contenu complet du dossier public (point d'entrée index.php, etc...) soit copié dans le dossier de build. (voir [discussion](https://github.com/lhapaipai/vite-bundle/issues/17)). En activant cette option l'extension active tout de même un serveur local pour que le serveur de développement de Vite puisse renvoyer les fichiers présents dans le dossier public.

Si vous souhaitez tout de même utiliser l'option `publicDir` de vite, désactivez d'abord cette option.

::: tip
Cette option sera supprimée dès que l'option `build.copyPublicDir` de Vite sera définitivement adoptée.
:::


## sriAlgorithm

- **Type :** `false | "sha256" | "sha384" | "sha512"`
- **Valeur par défaut :** `false`

Génère des clés de hachage lors de la génération de vos fichiers. À utiliser si vous souhaitez déployer vos ressources sur un CDN.

## enforcePluginOrderingPosition

- **Type :** `boolean`
- **Valeur par défaut :** `true`

Force l'exécution du plugin à la fin. Cela nous garanti que tous les fichiers seront traités et permet notamment de générer les bon hachages de nos fichiers si l'on souhaite ajouter des attributs d'intégrité à nos scripts. si vous désactivez cette option le plugin symfony sera exécuté à l'emplacement où il a été déclaré.

## <del>publicDirectory</del>

- **Type :** `string`
- **Valeur par défaut :** `"public"`
- **Déprécié** (sera retiré dans les versions 5.x)

Chemin relatif depuis le dossier racine de votre projet vers le dossier public de votre serveur web. Dans certains cas il peut s'agir de `www` ou `public_html`.

::: warning
`publicDirectory` est déprécié, vous devrez configurer `base` et `build.outDir` directement depuis la configuration de vite. Ceci permet d'éviter les confusions entre des options du plugin et de vite et également de permettre l'utilisation d'un CDN.
```js
export default defineConfig({
  plugins: [
    symfonyPlugin({
      buildDirectory: "build", // [!code --]
      publicDirectory: "public", // [!code --]
    }),
  ],
  base: "/build/" // [!code ++]
  build: {
    outDir: "public/build" // [!code ++]
  },
});
```
:::

## <del>buildDirectory</del>

- **Type :** `string`
- **Valeur par défaut :** `"build"`
- **Déprécié** (sera retiré dans les versions 5.x)

Chemin relatif depuis votre dossier public dans lequel ont été compilés vos fichiers à la suite d'un `vite build`.

::: warning
Voir remarque plus haut.
:::


## <del>viteDevServerHostname</del>

- **Type :** `null | string`
- **Valeur par défaut :** `null`
- **Déprécié** (sera retiré dans les versions 5.x)

Si vous avez spécifié l'option Vite `server.host` à `0.0.0.0` (pour Docker notamment) vous aurez probablement besoin de configurer `viteDevServerHostname` à 'localhost'. Voir [discussion](https://github.com/lhapaipai/vite-bundle/issues/26).
