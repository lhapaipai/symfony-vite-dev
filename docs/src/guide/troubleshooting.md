# Troubleshooting

- if you experience unwanted reloads of your application, read the section [https/http in development](#https--http-in-development).

- if you want to reduce the FOUC ([flash of unstyled content](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)), read the [Tips : css file as entrypoint](/guide/tips#css-files-as-entrypoint) page section.

- Reference to asset files less than 4kb. **An exception has been thrown during the rendering of a template (assets "assets/images/small-asset-less-than-4kb.png" not found in manifest file "/path-to-your-project/public/build/manifest.json".)** if you reference an asset file of less than 4kb, Vite will have chosen by default to make its content inline. You will therefore not be able to reference this file using the Twig `asset` function.

```twig
<img src="{{ asset('assets/images/logo-symfony-less-4kb.png') }}">
```
A solution may be to explicitly configure Vite not to make its assets inline by defining the vite configuration option [`build.assetsInlineLimit`](https://vitejs.dev/config/build-options.html#build-assetsinlinelimit) to 0.
