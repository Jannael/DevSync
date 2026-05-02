import devsync from '../DEVSYNC.json'
import { parseDevsync } from '../src/devsync-validator'

export * from '../src/devsync-validator'

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
