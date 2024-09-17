# Stimulus : in depth ⚙️

In order to facilitate the integration of Stimulus into Symfony applications, the latter has created a specific bundle `symfony/stimulus-bundle`. This bundle adds:

- Twig functions and filters to easily generate `data-*` attributes
- services to create Stimulus compatible `data-*` attributes and use them in your own services.
- a system for automatic and lazy loading of Stimulus controllers via an npm package `@symfony/stimulus-bridge` linked to the bundle. The latter will analyze
   - the `assets/controllers.json` file for your third-party controllers
   - controllers stored in an `assets/controllers` folder
and will return code for the Stimulus app to automatically preload.

![Stimulus How does it works ?](/graphs/stimulus.svg)

On top of that Symfony has built an entire `Symfony UX` eco-system based on bundles which each integrate `Stimulus` controllers.


The npm package `@symfony/stimulus-bridge` is not compatible with Vite:
   - usage of `require.context`
   - usage of `webpack` loaders

the `vite-plugin-symfony` plugin replaces `@symfony/stimulus-bridge` and provides the bridge between `symfony/stimulus-bundle`, `Symfony UX` and `Vite`.
