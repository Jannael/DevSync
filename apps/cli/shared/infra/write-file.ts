import { mkdir, writeFile as fsWriteFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { GConstructor } from '@/shared/infra/mixin-constructor'
import { ServerError } from '@/error/error-instance'

// Mixins pattern for shared infrastructure code
export function writeFileMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends Base {
    async writeFile({ path, data }: { path: string; data: string }): Promise<void> {
      try {
        const fullPath = resolve(process.cwd(), path)
        await mkdir(dirname(fullPath), { recursive: true })
        await fsWriteFile(fullPath, data, 'utf8')
      } catch {
        throw new ServerError('Failed to write file')
      }
    }
  }
}
