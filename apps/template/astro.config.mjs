// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import { defaultLang, languages } from './src/devsync'

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: defaultLang,
    locales: languages,
    routing: {
      prefixDefaultLocale: true,
    },
  },
})
