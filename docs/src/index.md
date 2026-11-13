---
titleTemplate: ':title'
# https://vitepress.dev/reference/default-theme-home-page
layout: home
description: Documentation to integrate Vite into your Symfony application.

hero:
  name: "Symfony & Vite"
  text: "Documentation"
  tagline: Give wings to your Sym[ph]on[ie] application.
  dependencies:
    - icon:
        src: /images/logo-packagist.svg
        width: 30
        height: 35
      prefix: composer require
      name: pentatrion/vite-bundle
    - icon:
        src: /images/logo-npm.svg
        width: 50
        height: 19.45
      prefix: npm i -D
      name: vite-plugin-symfony
  image:
    src: /symfony-vite.svg
    alt: Symfony & Vite
  actions:
    - theme: brand
      text: Getting started
      link: /guide/getting-started
    - theme: alt
      text: Installation
      link: /guide/installation
    - theme: alt
      text: Migration v8
      link: /extra/migration
  extra:
    type: tip
    title: Try Symfony Reprise
    description: <a href="https://symfony.com/packages/reprise">Symfony Reprise</a> is the official Symfony integration for Vite, and it is the recommended choice for new projects. If you already use <code>pentatrion/vite-bundle</code> and <code>vite-plugin-symfony</code>, a <a href="https://symfony.com/bundles/reprise#migrating-from-pentatrion-vite-bundle">migration guide</a> is available.
features:
  - icon: ⚡️
    title: Easy configuration
    details: Fast installation with Bundle Flex recipe and preconfigured Vite plugin.
  - icon:
      src: /images/logo-twig.svg
      wrap: true
      width: 32
      height: 23
    title: Twig functions
    details: Provide Twig functions for your Twig templates.
  - icon: 📦
    title: Assets management
    details: Integrate your assets into Symfony with custom Asset version Strategy.
  - icon:
      src: /images/logo-stimulus.svg
      width: 32
      height: 32
      wrap: true
    title: Stimulus / Symfony UX
    details: Easy integration with Symfony UX components and HMR.
  - icon: 🧩
    title: Advanced features
    details: Custom attributes, Multiple configurations, Dependency injection
  - icon: 🚀
    title: Performances
    details: Preload assets, Cache for config files

---
