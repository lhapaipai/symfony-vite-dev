# Using a CDN

If you want to deploy your static resources (js/images) on a CDN some additional settings will have to be put in place.

## Setup Vite

The `base` option of vite's config will need to be adjusted to point to your CDN.

```js
// vite.config.js
export default defineConfig({
   plugins: [
     symfonyPlugin(),
   ],

   base: 'http://cdn.your-cdn-provider.com', // [!code hl]
});
```

## Add integrity attributes

If the domain of your CDN is different from the domain hosting your site you will need to configure `vite-plugin-symfony` to support integrity hashes.

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

## Tips

By following this configuration your `public/build/entrypoints.json` file will be correctly configured to point to your CDN files.

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

You will therefore be able to deploy the contents of your `public/build` folder on your CDN.

::: warning
The file generation step must always be performed on your server because it is the `public/build/entrypoints.json` file which is hosted on your site and not the `http://cdn.your-cdn-provider.com/entrypoints.json` file which will be used for integrity hashes.
:::


:::tip
Consider adding the `Access-Control-Allow-Origin` header in your CDN's HTTP responses.
:::
