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
          { text: 'Guide', link: '/guide/installation' },
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
            items: [
              { text: 'Installation', link: '/guide/installation' },
              { text: 'Configuration', link: '/guide/configuration' },
              { text: 'Twig functions', link: '/guide/twig-functions' },
              { text: 'Assets', link: '/guide/assets' },
              { text: 'Multiple configurations', link: '/guide/multiple-configurations' },
              { text: 'Tips', link: '/guide/tips' },
              // { text: 'Getting started', link: '/guide/getting-started' },
              { text: 'Troubleshouting', link: '/guide/troubleshouting' }
            ]
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
          },
          // {
          //   text: 'Examples',
          //   items: [
          //     {
          //       text: 'Basic',
          //       link: '/examples/basic'
          //     }
          //   ]
          // }
          {
            text: 'Extra',
            items: [
              { text: 'Compatibility', link: '/extra/compatibility' },
              { text: 'In depth', link: '/extra/in-depth' },
              { text: 'Manual installation', link: '/extra/manual-installation' },
              { text: 'Migration Webpack Encore', link: '/extra/migration-webpack-encore' }
            ]
          }
        ],
        footer: {
          message: 'Released under the MIT License.'
        }
      }
    }
    // fr: {
    //   label: 'Français',
    //   lang: 'fr',
    //   description: 'Guide du développeur',
    //   themeConfig: {
    //     docFooter: {
    //       prev: 'Page précédente',
    //       next: 'Page suivante'
    //     },
    //     nav: [
    //       { text: 'Guide', link: '/fr/guide/getting-started' },
    //       {
    //         text: 'Configuration',
    //         items: [
    //           {
    //             text: 'Vite Bundle',
    //             link: '/fr/config/vite-bundle'
    //           },
    //           {
    //             text: 'Vite plugin Symfony',
    //             link: '/fr/config/vite-plugin-symfony'
    //           }
    //         ]
    //       }
    //       // {
    //       //   text: 'Exemples',
    //       //   link: '/fr/examples/basic'
    //       // }
    //     ],

    //     sidebar: [
    //       {
    //         text: 'Guide',
    //         items: [{ text: 'Bien démarrer', link: '/fr/guide/getting-started' }]
    //       },
    //       {
    //         text: 'Configuration',
    //         items: [
    //           {
    //             text: 'Vite Bundle',
    //             link: '/fr/config/vite-bundle'
    //           },
    //           {
    //             text: 'Vite plugin Symfony',
    //             link: '/fr/config/vite-plugin-symfony'
    //           }
    //         ]
    //       }
    //       // {
    //       //   text: 'Exemples',
    //       //   items: [
    //       //     {
    //       //       text: 'Basique',
    //       //       link: '/fr/examples/basic'
    //       //     }
    //       //   ]
    //       // }
    //     ],
    //     footer: {
    //       message: 'Publié sous la licence MIT.'
    //     },

    //     darkModeSwitchLabel: 'Apparence',
    //     returnToTopLabel: 'Retour en haut',
    //     lastUpdatedText: 'Dernière mise à jour',
    //     outlineTitle: 'Sur cette page'
    //   }
    // }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/symfony-vite.svg',

    socialLinks: [{ icon: 'github', link: 'https://github.com/lhapaipai/vite-bundle' }]
  }
});
