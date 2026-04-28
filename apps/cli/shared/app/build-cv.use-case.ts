import type { GConstructor } from '@/shared/infra/mixin-constructor'
import { GREEN, BOLD } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { pathCvPDF } from '@/constants/paths'
import { createPDFMixin } from '@/shared/infra/create-pdf'
import { getHTMLFromCVComponentMixin } from '@/shared/infra/get-html-from-cv-component'

// Mixins pattern for shared infrastructure code
export function createCVMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends getHTMLFromCVComponentMixin(createPDFMixin(Base)) {
    async buildCV() {
      console.log(`${SPACE}${GREEN('1.')} Building CV and generating PDF...`)
      const html = await this.getHTMLFromCvComponent()
      await this.createPDF({ html, path: pathCvPDF })
      console.log(`${SPACE}${CHECK(`CV generated at ${BOLD(pathCvPDF)}`)}`)
      console.log('')
    }
  }
}
