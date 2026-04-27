import { resolve } from 'node:path'

export const pathCVComponent = './src/components/cv.astro'
export const pathCvPDF = './CV.pdf'
export const CWD_PACKAGE_JSON_PATH = resolve(process.cwd(), 'package.json')
export const CV_ROUTE_OUTPUT_PATH = resolve(process.cwd(), 'dist', 'cv', 'index.html')
export const TEMPLATE_DIRECTORY = resolve(import.meta.dir, '..', '..', '..', '..', 'template')
export const pathREADME = './README.md'
export const pathLinkedin = './linkedin.md'
export const pathAcademics = './academics/README.md'