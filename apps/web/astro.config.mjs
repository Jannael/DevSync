// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Devsync documentation',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/jannael/devsync' }],
      sidebar: [
        {
          label: 'Getting Started',
          link: '/',
        },
        {
          label: 'Commands',
          link: '/commands/',
        },
        {
          label: 'Configuration',
          link: '/configuration/',
        },
        {
          label: 'Create Custom Template',
          link: '/create-template/',
        },
        {
          label: 'GitHub Actions',
          link: '/github-actions/',
        },
        {
          label: 'How It Works',
          items: [
            {
              label: 'Init Command',
              link: '/how-it-works/init-command/',
            },
            {
              label: 'Build Command',
              link: '/how-it-works/build-command/',
            },
            {
              label: 'Create Template',
              link: '/how-it-works/create-template/',
            },
          ],
        },
        {
          label: 'Troubleshooting',
          link: '/troubleshooting/',
        },
      ],
    }),
  ],
})
