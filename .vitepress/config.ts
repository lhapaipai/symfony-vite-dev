import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
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
        nav: [
          { text: 'Guide', link: '/guide/getting-started' },
          {
            text: 'Configuration',
            items: [
              {
                text: 'Vite Bundle',
                link: '/config/vite-bundle'
              },
              {
                text: 'Vite plugin Symfony',
                link: '/config/vite-plugin-symfony'
              }
            ]
          }
          // {
          //   text: 'Examples',
          //   link: '/examples/basic'
          // }
        ],

        sidebar: [
          {
            text: 'Guide',
            items: [{ text: 'Getting started', link: '/guide/getting-started' }]
          },
          {
            text: 'Configuration',
            items: [
              {
                text: 'Vite Bundle',
                link: '/config/vite-bundle'
              },
              {
                text: 'Vite plugin Symfony',
                link: '/config/vite-plugin-symfony'
              }
            ]
          }
          // {
          //   text: 'Examples',
          //   items: [
          //     {
          //       text: 'Basic',
          //       link: '/examples/basic'
          //     }
          //   ]
          // }
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
        docFooter: {
          prev: 'Page précédente',
          next: 'Page suivante'
        },
        nav: [
          { text: 'Guide', link: '/fr/guide/getting-started' },
          {
            text: 'Configuration',
            items: [
              {
                text: 'Vite Bundle',
                link: '/fr/config/vite-bundle'
              },
              {
                text: 'Vite plugin Symfony',
                link: '/fr/config/vite-plugin-symfony'
              }
            ]
          }
          // {
          //   text: 'Exemples',
          //   link: '/fr/examples/basic'
          // }
        ],

        sidebar: [
          {
            text: 'Guide',
            items: [{ text: 'Bien démarrer', link: '/fr/guide/getting-started' }]
          },
          {
            text: 'Configuration',
            items: [
              {
                text: 'Vite Bundle',
                link: '/fr/config/vite-bundle'
              },
              {
                text: 'Vite plugin Symfony',
                link: '/fr/config/vite-plugin-symfony'
              }
            ]
          }
          // {
          //   text: 'Exemples',
          //   items: [
          //     {
          //       text: 'Basique',
          //       link: '/fr/examples/basic'
          //     }
          //   ]
          // }
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
