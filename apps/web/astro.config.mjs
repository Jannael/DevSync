// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Devsync documentation',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/jannael/devsync' }],
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
        es: {
          label: 'Español',
          lang: 'es'
        },
      },
    }),
  ],
})
