# Gestion des assets avec Vite

Lorsque vous référencez des fichiers de ressources dans vos fichiers js ou css, vous devez vous rappeler que vous devez utiliser un chemin relatif si vous souhaitez que Vite traite votre fichier.
- **tous vos fichiers définis avec un chemin absolu seront ignorés par Vite** et seront laissés tels quels dans vos fichiers de construction. Vous pouvez spécifier un chemin absolu relatif à votre dossier public. cette pratique n'est pas recommandée car vos fichiers de ressources ne seront pas versionnés.
- **tous vos fichiers définis avec un chemin relatif seront traités par Vite**. Les chemins sont relatifs au fichier où ils sont référencés. Toutes vos ressources référencés via un chemin relatif seront renommés avec un hash et versionnés en production ou bien seulement servis par Vite en développement.

## Composant Symfony Asset

Chaque fois que vous lancez un `build` avec Vite, deux fichiers de configuration sont générés dans votre dossier de sortie (emplacement par défaut : public/build/) : `manifest.json` (généré par le plugin Manifest interne à Vite), entrypoints.json (généré par vite-plugin-symfony).

Le fichier `manifest.json` est nécessaire pour obtenir le nom des ressources versionnées, tels que les fichiers de police de caractère ou les fichiers image.

vous pouvez donc utiliser le composant asset de Symfony et sa fonction asset pour tirer parti de ce fichier.
Pour pouvoir l'utiliser pendant le développement, vous devrez utiliser `ViteAssetVersionStrategy`.

```yaml
# config/packages/framework.yaml
framework:
    assets:
        version_strategy: 'Pentatrion\ViteBundle\Asset\ViteAssetVersionStrategy'

```

Vous pouvez également utiliser la fonction Twig `asset()` en spécifiant le chemin de votre fichier d'asset par rapport à votre chemin racine (pour des raisons de compatibilité avec le fichier `manifest.json` généré par vite) spécifié dans votre `vite.config.js`.

```twig
<body>
    <img src="{{ asset('assets/images/avatar.jpg') }}" />
</body>
```

Vous pouvez utiliser cette fonction `asset()` uniquement avec des ressources référencées par des fichiers JavaScript ou CSS.

Si vous souhaitez que Vite connaisse d'autres ressources, vous pouvez importer un répertoire de ressources dans le point d'entrée de votre application. Par exemple, si vous souhaitez versionner toutes les images stockées dans `assets/images`, vous pouvez ajouter ce qui suit dans votre point d'entrée `app`. (je ne vous recommande pas vraiment cette méthode mais plutôt celle qui suit en définissant plusieurs stratégies)

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
framework:
    assets:
        packages:
            vite:
                version_strategy: 'Pentatrion\ViteBundle\Asset\ViteAssetVersionStrategy'
```

```twig
{{ asset('assets/images/avatar.jpg', 'vite') }}

{# strategie par défaut #}
{{ asset('other-location/logo.svg')}}
```
