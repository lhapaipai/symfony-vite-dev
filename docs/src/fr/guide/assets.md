# Gestion des assets avec Vite

Lorsque vous référencez des fichiers de ressources dans vos fichiers js ou css, vous devez vous rappeler que vous devez utiliser un chemin relatif si vous souhaitez que Vite traite votre fichier.
- **tous vos fichiers définis avec un chemin absolu seront ignorés par Vite** et seront laissés tels quels dans vos fichiers de construction. Vous pouvez spécifier un chemin absolu relatif à votre dossier public. cette pratique n'est pas recommandée car vos fichiers de ressources ne seront pas versionnés.
- **tous vos fichiers définis avec un chemin relatif seront traités par Vite**. Les chemins sont relatifs au fichier où ils sont référencés. Toutes vos ressources référencés via un chemin relatif seront renommés avec un hash et versionnés en production ou bien seulement servis par Vite en développement.

## Composant Symfony Asset

Chaque fois que vous lancez un `build` avec Vite, deux fichiers de configuration sont générés dans votre dossier de sortie (emplacement par défaut : public/build/) :

- `manifest.json` : généré par le plugin Manifest interne à Vite
- `entrypoints.json` : généré par vite-plugin-symfony.

Le fichier `manifest.json` est nécessaire pour obtenir le nom des ressources versionnées, tels que les fichiers de police de caractère ou les fichiers image.

vous pouvez utiliser le [composant Asset de Symfony](https://symfony.com/doc/current/components/asset.html) et sa fonction `asset` pour référencer vos assets dans vos fichiers `twig`.
Pour permettre cette association entre Symfony et votre fichier `manifest.json`, vous devrez utiliser `ViteAssetVersionStrategy`.

```yaml
# config/packages/framework.yaml
framework:
    assets:
        version_strategy: 'Pentatrion\ViteBundle\Asset\ViteAssetVersionStrategy'

```

Vous pourrez alors utiliser la fonction Twig `asset()` en spécifiant le chemin de votre fichier d'asset relativement à votre dossier `root` spécifié dans votre `vite.config.js`. (pour des raisons de compatibilité avec le fichier `manifest.json` généré par vite)

```twig
<body>
    <img src="{{ asset('assets/images/avatar.jpg') }}" />
</body>
```

Vous pouvez utiliser cette fonction `asset()` **uniquement avec des ressources référencées dans vos fichiers JavaScript ou CSS**. Le fichier `manifest.json` est généré pendant l'étape de compilation de votre code JavaScript par Vite. C'est une sorte de résumé des fichiers qu'il a traité. Si votre fichier n'est référencé nulle part il n'apparaitra donc pas dans le `manifest.json`.

Si vous souhaitez que Vite connaisse d'autres ressources, vous pouvez importer un répertoire de ressources dans le point d'entrée de votre application. Par exemple, si vous souhaitez versionner toutes les images stockées dans `assets/images`, vous pouvez ajouter ce qui suit dans votre point d'entrée `app`. (je ne vous recommande pas vraiment cette méthode mais plutôt celle qui suit en définissant plusieurs stratégies)

Attention, par défaut Vite rendra en ligne tous ses assets de taille inférieure à 4kb, vous ne pourrez donc faire référence à ces fichiers. (voir explications et solution dans [résolutions de problèmes](/fr/guide/troubleshooting.html#resolution-de-problemes)).


```
├──assets
│ ├──images
│ │ ├──climbing.jpg
│ │ ├──violin.jpg
│ │ ├──...
│ │
│ ├──app.js
│...
```

```js
// assets/app.js
import.meta.glob([
    './images/**'
]);
```

## Ressources provenant de multiples sources.


Si vous souhaitez utiliser la fonction Twig `asset()` pour servir des ressources de Vite mais que vous souhaitez servir des ressources provenant d'une autre source, vous pouvez définir plusieurs stratégies.


```yaml
# config/packages/framework.yaml
framework:
    assets:
        packages:
            vite:
                version_strategy: 'Pentatrion\ViteBundle\Asset\ViteAssetVersionStrategy'
```

```twig
{# stratégie personnalisée avec Vite #}
{{ asset('assets/images/avatar.jpg', 'vite') }}

{# stratégie par défaut #}
{{ asset('other-location/logo.svg')}}
```
