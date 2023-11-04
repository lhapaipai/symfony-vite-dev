# Utiliser un CDN

Si vous souhaitez déployer vos ressources statiques (js/images) sur un CDN quelques réglages supplémentaires devront être mis en place.

## Configurer Vite

L'option `base` de la configuration de vite devra être ajustée pour pointer vers votre CDN.

```js
// vite.config.js
export default defineConfig({
  plugins: [
    symfonyPlugin(),
  ],

  base: 'http://cdn.your-cdn-provider.com', // [!code hl]
});
```

## Ajouter des attributs d'intégrité

Si le domaine de votre CDN est différent de celui hébergeant votre site vous devrez configurer `vite-plugin-symfony` pour qu'il prenne en charge des hashages d'intégrité.

```js
// vite.config.js
export default defineConfig({
  plugins: [
    symfonyPlugin({
      sriAlgorithm: "sha256" // [!code hl]
    }),
  ],
});
```

```yaml
# config/packages/pentatrion_vite.yaml
pentatrion_vite:
    crossorigin: anonymous // [!code hl]
```

## Conseils

En suivant cette configuration votre fichier `public/build/entrypoints.json` sera correctement configuré pour pointer vers les fichiers de votre CDN.

```json
{
  "base": "http://cdn.your-cdn-provider.com/",

  "entryPoints": {

    "app": {
      "assets": [],
      "css": [],
      "js": ["http://cdn.your-cdn-provider.com/assets/app-dc399f15.js"],
      "legacy": false,
      "preload": []
    }
  },
  "legacy": false,
  "metadatas": {
    "http://cdn.your-cdn-provider.com/assets/app-dc399f15.js": {
      "hash": "sha256-k/0PccRNhijyiBqBUXa8Uw3GQdPxOk1iPIfqarKGEY0="
    }
  },
  "version": "6.0.0",
  "viteServer": null,
}
```

Vous pourrez donc déployer le contenu de votre dossier `public/build` sur votre CDN.

::: warning
L'étape de génération des fichiers doit toujours être effectuée sur votre serveur car c'est le fichier `public/build/entrypoints.json` qui est hébergé chez vous et non le fichier `http://cdn.your-cdn-provider.com/entrypoints.json` qui sera utilisé pour les hashages d'intégrité.
:::


::: tip
Pensez à ajouter l'en-tête `Access-Control-Allow-Origin` dans les réponses HTTP de votre CDN.
:::
