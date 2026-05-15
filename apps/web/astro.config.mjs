// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      favicon: '/favicon.svg',
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

  vite: {
    plugins: [tailwindcss()],
  },
})