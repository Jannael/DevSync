import devsync from './DEVSYNC.json'
import { parseDevsync } from './devsync-validator'

export * from './devsync-validator'

export const devsyncGlobalFields = [
  'name',
  'img',
  'socialMedia',
  'site',
  'githubUserName',
  'defaultLang',
] as const

export const languages = Object.keys(devsync).filter(
  (key) => !devsyncGlobalFields.includes(key as (typeof devsyncGlobalFields)[number])
)
export const defaultLang = devsync.defaultLang

export default parseDevsync(devsync)
