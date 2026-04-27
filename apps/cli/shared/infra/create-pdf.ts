import puppeteer from 'puppeteer'

type GConstructor<T = {}> = new (...args: any[]) => T

// Mixins pattern for shared infrastructure code
export function createPDFMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends Base {
    async createPDF({ html, path }: { html: string; path: string }): Promise<void> {
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
    }
  }
}
