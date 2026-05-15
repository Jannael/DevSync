// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://devsync.work',
  integrations: [
    starlight({
      title: 'Devsync documentation',
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/favicon-32x32.svg',
            sizes: '32x32',
            type: 'image/svg+xml',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/favicon-16x16.svg',
            sizes: '16x16',
            type: 'image/svg+xml',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/logo-192-black.webp',
            sizes: '192x192',
            type: 'image/webp',
            media: '(prefers-color-scheme: light)',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            href: '/logo-192-white.webp',
            sizes: '192x192',
            type: 'image/webp',
            media: '(prefers-color-scheme: dark)',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'apple-touch-icon',
            href: '/apple-touch-icon-black.webp',
            media: '(prefers-color-scheme: light)',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'apple-touch-icon',
            href: '/apple-touch-icon-white.webp',
            media: '(prefers-color-scheme: dark)',
          },
        },
      ],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/jannael/devsync' }],
    }),
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
