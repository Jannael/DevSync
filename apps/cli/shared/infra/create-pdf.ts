import puppeteer from 'puppeteer'
import type { GConstructor } from '@/shared/infra/mixin-constructor'
import { ServerError } from '@/error/error-instance'

// Mixins pattern for shared infrastructure code
export function createPDFMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends Base {
    async createPDF({ html, path }: { html: string; path: string }): Promise<void> {
      try {
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: 'networkidle0' })
        await page.emulateMediaType('screen')
        await page.pdf({
          path,
          format: 'A4',
          printBackground: true,
          margin: {
            top: '12mm',
            right: '12mm',
            bottom: '12mm',
            left: '12mm',
          },
        })
        await browser.close()
      } catch {
        throw new ServerError('Failed to create PDF')
      }
    }
  }
}
