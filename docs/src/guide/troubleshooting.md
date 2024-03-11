# Troubleshooting 🧐

- If you experience unwanted reloads of your application, read the section [https/http in development](#https--http-in-development).

- If you want to reduce the FOUC ([flash of unstyled content](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)), read the [Tips : css file as entrypoint](/guide/tips#css-files-as-entrypoint) page section.

- When referring to asset files smaller than 4kb, an exception may occur during template rendering. This exception is triggered when the referenced asset, such as 'assets/images/small-asset-less-than-4kb.png', is not found in the manifest file located at '/path-to-your-project/public/build/manifest.json'.
  By default, Vite inlines the content of small asset files. Consequently, you won't be able to reference these files using the Twig asset function.

```twig
<img src="{{ asset('assets/images/logo-symfony-less-4kb.png') }}">
```

You may work around this by explicitly configuring Vite to disable asset inlining by setting the configuration option [`build.assetsInlineLimit`](https://vitejs.dev/config/build-options.html#build-assetsinlinelimit) to 0.
