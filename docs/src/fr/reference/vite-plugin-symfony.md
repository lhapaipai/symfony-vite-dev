# Vite plugin Symfony Options

## debug

- **Type :** `boolean`
- **Valeur par défaut :** `false`

Affiche dans la console la configuration complète de Vite lorsqu'elle a été complètement résolue (`configResolved`).


## enforcePluginOrderingPosition

- **Type :** `boolean`
- **Valeur par défaut :** `true`

Force l'exécution du plugin à la fin. Cela nous garanti que tous les fichiers seront traités et permet notamment de générer les bon hachages de nos fichiers si l'on souhaite ajouter des attributs d'intégrité à nos scripts. si vous désactivez cette option le plugin symfony sera exécuté à l'emplacement où il a été déclaré.


## enforceServerOriginAfterListening

- **Type :** `boolean`
- **Valeur par défaut :** `true`

par défaut tout import de resource dans un fichier est résolu le serveur de Vite sans spécifier l'origine.

```js
import logo from './assets/logo.svg'
// voir https://github.com/vitejs/vite/blob/main/packages/vite/src/node/plugins/asset.ts#L289

console.log(logo);
// '/build/assets/logo.svg'
```
cela se révèle problèmatique avec une utilisation sous Symfony car c'est le serveur php de Symfony qui sera à l'origine de la requête et celui-ci ne sera pas capable de résoudre le chemin. Jusqu'à la v5, `pentatrion/vite-bundle` transmettait la requête à vite par proxy. Avec cette option, vos assets seront résolus plus rapidement car ne transiteront pas par Symfony.

Si vous rencontrez des problèmes d'affichage de resources car vous êtes dans des environnements spécifiques (Docker par exemple), vous pourriez être amené à désactiver cette option.


## originOverride

- **Type:** `null | string`
- **Valeur par défaut:** `null`

Remplace l'origine pour les points d'entrée avec le serveur de développement. Utile lorsque vous utilisez un serveur proxy. Si vous avez spécifié l'option Vite `server.host` à `0.0.0.0` (pour Docker notamment) vous aurez probablement besoin de configurer `originOverride` à `http://localhost`. Si vous souhaitez préciser le scheme, l'hôte et le port, utilisez `originOverride` sinon préférez `viteDevServerHostname`.

## refresh

- **Type :** `boolean | string[]`
- **Valeur par défaut :** `false`

Permet de relancer le serveur de développement de Vite lorsque vos fichiers sont modifiés. En mettant cette valeur à `true`, le serveur vérifiera les modifications sur vos fichiers Twig (équivalent à la valeur `["templates/**/*.twig"]`). Vous pouvez également définir votre propre tableau de motif.

Vite utilise la librairie [picomatch](https://github.com/micromatch/picomatch) pour interpréter les motifs.

## servePublic

- **Type :** `boolean` | string
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

## stimulus

- **Type :** `boolean | string`
- **Valeur par défaut :** `false`

Active le bridge qui va interpréter le fichier `assets/controllers.json` pour les contrôleurs tiers de Stimulus (incluant Symfony UX).

Saisir `true` si votre fichier est situés à l'emplacement par défaut `assets/controllers.json` sinon spécifiez le chemin vers votre fichier de référence.

## viteDevServerHostname

- **Type :** `null | string`
- **Valeur par défaut :** `null`

Si vous avez spécifié l'option Vite `server.host` à `0.0.0.0` (pour Docker notamment) vous aurez probablement besoin de configurer `viteDevServerHostname` à 'localhost'. Voir [discussion](https://github.com/lhapaipai/vite-bundle/issues/26).
