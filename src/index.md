---
titleTemplate: ':title'
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Symfony & Vite"
  text: "Documentation"
  tagline: Give wings to your Sym[ph]on[ie] application.
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
      text: Bundle Options
      link: /config/vite-bundle
    - theme: alt
      text: Vite plugin Options
      link: /config/vite-plugin-symfony

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
