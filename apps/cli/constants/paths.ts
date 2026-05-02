import { resolve } from 'node:path'

export const CWD_PACKAGE_JSON = resolve(process.cwd(), 'package.json')
export const TEMPLATE_DIRECTORY = resolve(import.meta.dir, '..', '..', 'template')
export const DEVSYNC_DIRECTORY = resolve(import.meta.dir, '..', '..', 'devsync')
export const README = './README.md'
export const ACADEMICS = './academics/README.md'
export const DEVSYNC_JSON = resolve(process.cwd(), 'DEVSYNC.json')

// Multi-language outputs
export const LINKEDIN = (lang: string) => `./linkedin-${lang}.md`
export const CV_PDF = (lang: string) => `./public/CV-${lang}.pdf`
export const CV_ROUTE_OUTPUT = (lang: string) =>
  resolve(process.cwd(), 'dist', lang, 'cv', 'index.html')
