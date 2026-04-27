import type { BuildRepository as IBuildRepository } from '../domain/build-repository'
import {
  cp,
  readFile as fsReadFile,
  readdir,
} from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { readFileMixin } from '../../../shared/infra/read-file'
import { runBunCommand } from '../../../utils/run-bun-command'

const TEMPLATE_DIRECTORY = resolve(import.meta.dir, '..', '..', '..', '..', 'template')
const CWD_PACKAGE_JSON_PATH = resolve(process.cwd(), 'package.json')
const CV_ROUTE_OUTPUT_PATH = resolve(process.cwd(), 'dist', 'cv', 'index.html')

class BaseRepo {}

class BuildRepository extends readFileMixin(BaseRepo) implements IBuildRepository {
  async copyTemplate(): Promise<void> {
    const entries = await readdir(TEMPLATE_DIRECTORY, { withFileTypes: true })

    for (const entry of entries) {
      const sourcePath = join(TEMPLATE_DIRECTORY, entry.name)
      const destinationPath = join(process.cwd(), entry.name)

      await cp(sourcePath, destinationPath, {
        recursive: true,
        force: false,
        errorOnExist: false,
      })
    }
  }

  async getHTMLFromComponent(): Promise<string> {
    if (!existsSync(CWD_PACKAGE_JSON_PATH)) {
      throw new Error(
        'package.json not found in current directory. Run devsync build from the project root.',
      )
    }

    if (!existsSync(resolve(process.cwd(), 'node_modules'))) {
      await runBunCommand(['install'])
    }

    await runBunCommand(['run', 'build'])

    const html = await fsReadFile(CV_ROUTE_OUTPUT_PATH, 'utf8')
    const stylesheetRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi
    const stylesheetLinks = Array.from(html.matchAll(stylesheetRegex))
    let inlinedHTML = html

    for (const linkMatch of stylesheetLinks) {
      const [linkTag, href] = linkMatch

      const cssPath = href?.startsWith('/')
        ? resolve(process.cwd(), 'dist', href.slice(1))
        : resolve(dirname(CV_ROUTE_OUTPUT_PATH), href ?? '')

      const css = await fsReadFile(cssPath, 'utf8')
      inlinedHTML = inlinedHTML.replace(linkTag, `<style>${css}</style>`)
    }

    return inlinedHTML
  }
}

export const BuildRepositoryImpl = readFileMixin(BuildRepository)

export default BuildRepositoryImpl
