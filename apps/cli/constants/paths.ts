import { resolve } from 'node:path'

export const pathCVComponent = './src/pages/cv.astro'
export const CWD_PACKAGE_JSON_PATH = resolve(process.cwd(), 'package.json')
export const TEMPLATE_DIRECTORY = resolve(import.meta.dir, '..', '..', 'template')
export const pathREADME = './README.md'
export const pathAcademics = './academics/README.md'
export const DEVSYNC_JSON_PATH = resolve(process.cwd(), 'DEVSYNC.json')

// Multi-language outputs
export const pathLinkedin = (lang: string) => `./linkedin-${lang}.md`
export const pathCvPDF = (lang: string) => resolve(process.cwd(), 'dist', lang, 'cv', 'index.html') // astro generates the routes => /lang/cv/index.html
