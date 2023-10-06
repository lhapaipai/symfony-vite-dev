# Résolution de problèmes

- si vous rencontrez des rechargements intempestifs de votre application, lisez la section [https/http en développement](/fr/guide/tips.html#https-http-en-developpement).

- si vous souhaitez réduire le FOUC ([flash of unstyled content](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)), lisez les [Astuces : fichier css comme point d'entrée](/fr/guide/tips.html#fichiers-css-comme-point-d-entree).

- Référence à des fichiers d'assets de moins de 4kb. **An exception has been thrown during the rendering of a template (assets "assets/images/small-asset-less-than-4kb.png" not found in manifest file "/path-to-your-project/public/build/manifest.json".)** si vous faites référence à un fichier d'asset de moins de 4kb, Vite aura choisi par défaut de rendre son contenu en ligne. Vous ne pourrez donc pas faire référence à ce fichier en utilisant la fonction twig `asset`.

```twig
<img src="{{ asset('assets/images/logo-symfony-less-4kb.png') }}">
```
Une solution peut-être de demander explicitement à Vite de ne pas rendre en ligne ses assets en définissant la configuration de vite [`build.assetsInlineLimit`](https://vitejs.dev/config/build-options.html#build-assetsinlinelimit) à 0.
