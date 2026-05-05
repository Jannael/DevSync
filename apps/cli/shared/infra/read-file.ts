import { readFile as fsReadFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { GConstructor } from '@/shared/infra/mixin-constructor'
import { ServerError } from '@/error/error-instance'
import { SPACE } from '@/utils/icons-terminal'

// Mixins pattern for shared infrastructure code
export function readFileMixin<TBase extends GConstructor>(Base: TBase) {
  return class extends Base {
    async readFile({ path }: { path: string }): Promise<string> {
      try {
        const fullPath = resolve(process.cwd(), path)
        return await fsReadFile(fullPath, 'utf8')
      } catch {
        throw new ServerError(
          'Failed to read file',
          `${SPACE}${SPACE}Check if the file exists and is accessible.\n` +
            `${SPACE}${SPACE}Verify file permissions.`
        )
      }
    }
  }
}
