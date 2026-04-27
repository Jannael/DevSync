import { mkdir, writeFile as fsWriteFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

type GConstructor<T = {}> = new (...args: any[]) => T

// Mixins pattern for shared infrastructure code
export function writeFileMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends Base {
    async writeFile({ path, data }: { path: string; data: string }): Promise<void> {
      const fullPath = resolve(process.cwd(), path)
      await mkdir(dirname(fullPath), { recursive: true })
      await fsWriteFile(fullPath, data, 'utf8')
    }
  }
}
