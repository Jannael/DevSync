import type { GConstructor } from '@/shared/infra/mixin-constructor'
import { GREEN, BOLD } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { CV_PDF } from '@/constants/paths'
import { createPDFMixin } from '@/shared/infra/create-pdf'
import { getHTMLMixin } from '@/shared/infra/get-html'
import { $ } from 'bun'

// to get the CV route we get it from package.json (devsync.pathToCompiledCv)
// and we replace [lang] with the current language
export function createCVMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends getHTMLMixin(createPDFMixin(Base)) {
    async buildCV({ lang }: { lang: string }) {
      const CVPath = (await $`bun pm pkg get devsync.pathToCompiledCV`.text())
        .trim()
        .replace('[lang]', lang)
        .replace(/"/g, '')

      console.log(`${SPACE}${GREEN('-')} Building CV and generating PDF...`)
      const html = await this.getHTML({ path: CVPath })
      await this.createPDF({ html, path: CV_PDF(lang) })

      console.log(`${SPACE}${CHECK(`CV generated at ${BOLD(CV_PDF(lang))}`)}`)
      console.log('')
    }
  }
}
