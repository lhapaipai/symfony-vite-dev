import { defineConfig } from 'vitepress';
import { fileURLToPath, URL } from 'node:url';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPHero.vue$/,
          replacement: fileURLToPath(new URL('./theme/components/VPHero.vue', import.meta.url))
        },
        {
          find: /^.*\/VPButton.vue$/,
          replacement: fileURLToPath(new URL('./theme/components/VPButton.vue', import.meta.url))
        },
        {
          find: /^.*\/VPImage.vue$/,
          replacement: fileURLToPath(new URL('./theme/components/VPImage.vue', import.meta.url))
        },
        {
          find: '~theme',
          replacement: fileURLToPath(new URL('./theme', import.meta.url))
        }
      ]
    }
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  },
  srcDir: 'src',
  lang: 'fr',
  title: 'Symfony & Vite',
  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16x', href: '/favicon-16x16.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }]
  ],
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      description: 'Developper guide',

      themeConfig: {
        editLink: {
          pattern: 'https://github.com/lhapaipai/symfony-vite-dev/edit/main/docs/src/:path',
          text: 'Edit this page'
        },
        nav: [
          { text: 'Guide', link: '/guide/getting-started' },
          {
            text: 'Reference',
            items: [
              { text: 'Vite Bundle', link: '/reference/vite-bundle' },
              { text: 'Vite plugin Symfony', link: '/reference/vite-plugin-symfony' }
            ]
          }
        ],

        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Getting started', link: '/guide/getting-started' },
              { text: 'Installation', link: '/guide/installation' },
              { text: 'Configuration', link: '/guide/configuration' },
              { text: 'Twig functions', link: '/guide/twig-functions' },
              { text: 'Assets', link: '/guide/assets' },
              { text: 'Custom attributes', link: '/guide/custom-attributes'},
              { text: 'Dependency injection', link: '/guide/dependency-injection'},
              { text: 'Multiple configurations', link: '/guide/multiple-configurations' },
              { text: 'Performances', link: '/guide/performances' },
              { text: 'Using a CDN', link: '/guide/cdn' },
              { text: 'Tips', link: '/guide/tips' },
              { text: 'Troubleshooting', link: '/guide/troubleshooting' },
              { text: 'Examples', link: '/guide/examples' }
            ]
          },
          {
            text: 'Stimulus / Symfony UX',
            items: [
              { text: 'Installation', link: '/stimulus/installation'},
              { text: 'Symfony UX', link: '/stimulus/symfony-ux'},
              { text: 'Lazy controllers', link: '/stimulus/lazy-controllers'},
              { text: 'In Depth', link: '/stimulus/in-depth'},
            ]
          },
          {
            text: 'Reference',
            items: [
              { text: 'Vite Bundle', link: '/reference/vite-bundle' },
              { text: 'Vite plugin Symfony', link: '/reference/vite-plugin-symfony' }
            ]
          },
          {
            text: 'Extra',
            items: [
              { text: 'Compatibility', link: '/extra/compatibility' },
              { text: 'In depth', link: '/extra/in-depth' },
              { text: 'Manual installation', link: '/extra/manual-installation' },
              { text: 'Migration', link: '/extra/migration' },
              { text: 'Migration Webpack Encore', link: '/extra/migration-webpack-encore' },
              { text: 'Contribute', link: '/extra/contribute' }
            ]
          }
        ],
        footer: {
          message: 'Released under the MIT License.'
        }
      }
    },
    fr: {
      label: 'Français',
      lang: 'fr',
      description: 'Guide du développeur',
      themeConfig: {
        editLink: {
          pattern: 'https://github.com/lhapaipai/symfony-vite-dev/edit/main/docs/src/:path',
          text: 'Éditer cette page'
        },

        docFooter: {
          prev: 'Page précédente',
          next: 'Page suivante'
        },
        nav: [
          { text: 'Guide', link: '/fr/guide/getting-started' },
          {
            text: 'Référence',
            items: [
              { text: 'Vite Bundle', link: '/fr/reference/vite-bundle' },
              { text: 'Vite plugin Symfony', link: '/fr/reference/vite-plugin-symfony' }
            ]
          }
        ],

        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Bien démarrer', link: '/fr/guide/getting-started' },
              { text: 'Installation', link: '/fr/guide/installation' },
              { text: 'Configuration', link: '/fr/guide/configuration' },
              { text: 'Fonctions Twig', link: '/fr/guide/twig-functions' },
              { text: 'Assets', link: '/fr/guide/assets' },
              { text: 'Stimulus / Symfony UX', link: '/fr/guide/stimulus-symfony-ux'},
              { text: 'Attributs personnalisés', link: '/fr/guide/custom-attributes'},
              { text: 'Injection de dépendances', link: '/fr/guide/dependency-injection'},
              { text: 'Configurations multiples', link: '/fr/guide/multiple-configurations' },
              { text: 'Performances', link: '/fr/guide/performances' },
              { text: 'Utiliser un CDN', link: '/fr/guide/cdn' },
              { text: 'Conseils', link: '/fr/guide/tips' },
              { text: 'Résolutions de problèmes', link: '/fr/guide/troubleshooting' },
              { text: 'Exemples', link: '/fr/guide/examples' }
            ]
          },
          {
            text: 'Stimulus / Symfony UX',
            items: [
              { text: 'Installation', link: '/fr/stimulus/installation'},
              { text: 'Symfony UX', link: '/fr/stimulus/symfony-ux'},
              { text: 'Controleurs asynchrones', link: '/fr/stimulus/lazy-controllers'},
              { text: 'En profondeur', link: '/fr/stimulus/in-depth'},
            ]
          },
          {
            text: 'Configuration',
            items: [
              { text: 'Vite Bundle', link: '/fr/reference/vite-bundle' },
              { text: 'Vite plugin Symfony', link: '/fr/reference/vite-plugin-symfony' }
            ]
          },
          {
            text: 'Extra',
            items: [
              { text: 'Compatibilité', link: '/fr/extra/compatibility' },
              { text: 'En profondeur', link: '/fr/extra/in-depth' },
              { text: 'Installation manuelle', link: '/fr/extra/manual-installation' },
              { text: 'Migration', link: '/fr/extra/migration' },
              { text: 'Migration Webpack Encore', link: '/fr/extra/migration-webpack-encore' },
              { text: 'Contribuez', link: '/fr/extra/contribute' }
            ]
          }
        ],
        footer: {
          message: 'Publié sous la licence MIT.'
        },

        darkModeSwitchLabel: 'Apparence',
        returnToTopLabel: 'Retour en haut',
        lastUpdatedText: 'Dernière mise à jour',
        outlineTitle: 'Sur cette page'
      }
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/symfony-vite.svg',

    socialLinks: [{ icon: 'github', link: 'https://github.com/lhapaipai/vite-bundle' }]
  }
});
