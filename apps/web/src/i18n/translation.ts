import en from './en.json'
import es from './es.json'

export const translations = {
  en,
  es,
} as const

export type Language = keyof typeof translations

export function getTranslation(lang: string) {
  return translations[lang as Language] || translations.en
}
