import { readFile as fsReadFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { GConstructor } from '@/shared/infra/mixin-constructor'

// Mixins pattern for shared infrastructure code
export function readFileMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends Base {
    async readFile({ path }: { path: string }): Promise<string> {
      const fullPath = resolve(process.cwd(), path)
      return fsReadFile(fullPath, 'utf8')
    }
  }
}
