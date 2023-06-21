import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'fr',
  title: "Symfony & Vite",
  description: "Guide du développeur",
  locales: {
    root: { label: 'Français'},
    en: { label: 'English', link: 'https://en.symfony-vite.pentatrion.com'}
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/symfony-vite.svg',
    nav: [
      { text: 'Guide', link: '/demarrer' },
      { text: 'Configuration', items: [
        {
          text: 'Vite Bundle',
          link: '/config/vite-bundle'
        },
        {
          text: 'Vite plugin Symfony',
          link: '/config/vite-plugin-symfony' 
        }
      ]},
      { text: 'Exemples', items: [
        {
          text: 'Basique',
          link: '/exemples/basique'
        }
      ]
      }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
