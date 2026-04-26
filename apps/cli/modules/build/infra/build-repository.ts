import type { BuildRepository } from '../domain/build-repository'

class BuildRepositoryImpl implements BuildRepository {
  async copyTemplate(): Promise<void> {}

  async readFile({ path }: { path: string }): Promise<string> {
    return ''
  }

  async getHTMLFromComponent({ component }: { component: string }): Promise<string> {
    return ''
  }

  async createPDF({ html, path }: { html: string; path: string }): Promise<void> {}

  async writeFile({ path, data }: { path: string; data: string }): Promise<void> {}
}

export default BuildRepositoryImpl
