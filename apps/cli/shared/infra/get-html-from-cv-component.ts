import { readFile as fsReadFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { runBunCommand } from '@/utils/run-bun-command'
import { CWD_PACKAGE_JSON_PATH, CV_ROUTE_OUTPUT_PATH } from '@/constants/paths'
import type { GConstructor } from '@/shared/infra/mixin-constructor'
import { NotFound, ServerError } from '@/error/error-instance'

// Mixins pattern for shared infrastructure code
export function getHTMLFromCVComponentMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends Base {
    async getHTMLFromComponent(): Promise<string> {
      if (!existsSync(CWD_PACKAGE_JSON_PATH)) {
        throw new NotFound('Package.json not found')
      }

      if (!existsSync(resolve(process.cwd(), 'node_modules'))) {
        await runBunCommand(['install'])
      }

      await runBunCommand(['run', 'build'])

      try {
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
      } catch {
        throw new ServerError('CV build failed')
      }
    }
  }
}
