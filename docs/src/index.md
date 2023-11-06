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
        src: /images/packagist-logo.svg
        width: 30
        height: 35
      name: pentatrion/vite-bundle
    - icon:
        src: /images/npm-logo.svg
        width: 50
        height: 19.45
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
      text: Migration v6
      link: /extra/migration

features:
  - icon: ⚡️
    title: Easy configuration
    details: Fast installation with Bundle Flex recipe and preconfigured Vite plugin.
  - icon: 🛠️
    title: Twig functions
    details: Associate your entrypoints in your twig templates with twig functions.
  - icon: 📦
    title: Assets management
    details: Integrate your assets into Symfony with custom Asset version Strategy.
---
