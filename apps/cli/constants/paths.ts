import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname =
  typeof import.meta !== 'undefined' && import.meta.url
    ? resolve(fileURLToPath(import.meta.url), '..')
    : process.cwd()

export const CWD_PACKAGE_JSON = resolve(process.cwd(), 'package.json')
export const DEVSYNC_DIRECTORY = resolve(__dirname, '@core')
export const README = './README.md'
export const ACADEMICS = './academics/README.md'
export const DEVSYNC_JSON = resolve(process.cwd(), 'DEVSYNC.json')
export const DEFAULT_TEMPLATE_URL = 'https://github.com/jannael/devsync-default-template'

// Multi-language outputs
export const LINKEDIN = (lang: string) => `./linkedin-${lang}.md`
export const CV_PDF = (lang: string) => `./public/CV-${lang}.pdf`
export const CV_ROUTE_OUTPUT = (lang: string) =>
  resolve(process.cwd(), 'dist', lang, 'cv', 'index.html')
