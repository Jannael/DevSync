import type { BuildRepository } from '@/modules/build/domain/build-repository'
import { cp, readdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const TEMPLATE_DIRECTORY = resolve(import.meta.dir, '..', '..', '..', '..', 'template')

class BuildRepositoryImpl implements BuildRepository {
  async copyTemplate(): Promise<void> {
    const entries = await readdir(TEMPLATE_DIRECTORY, { withFileTypes: true })

    for (const entry of entries) {
      const sourcePath = join(TEMPLATE_DIRECTORY, entry.name)
      const destinationPath = join(process.cwd(), entry.name)

      await cp(sourcePath, destinationPath, {
        recursive: true,
        force: false,
        errorOnExist: true,
      })
    }
  }

  async readFile({ path: _path }: { path: string }): Promise<string> {
    return ''
  }

  async getHTMLFromComponent({ component: _component }: { component: string }): Promise<string> {
    return ''
  }

  async createPDF({ html: _html, path: _path }: { html: string; path: string }): Promise<void> {}

  async writeFile({ path: _path, data: _data }: { path: string; data: string }): Promise<void> {}
}

export default BuildRepositoryImpl
