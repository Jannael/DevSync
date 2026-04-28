import type { BuildRepository as IBuildRepository } from '../domain/build-repository'
import { cp, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { readFileMixin } from '@/shared/infra/read-file'
import { TEMPLATE_DIRECTORY } from '@/constants/paths'
import { ServerError } from '@/error/error-instance'

class BaseRepo {}

class BuildRepositoryImpl extends readFileMixin(BaseRepo) implements IBuildRepository {
  async copyTemplate(): Promise<void> {
    try {
      const entries = await readdir(TEMPLATE_DIRECTORY, { withFileTypes: true })

      for (const entry of entries) {
        const sourcePath = join(TEMPLATE_DIRECTORY, entry.name)
        const destinationPath = join(process.cwd(), entry.name)

        await cp(sourcePath, destinationPath, {
          recursive: true,
          force: false,
          errorOnExist: false,
        })
      }
    } catch {
      throw new ServerError('Failed to copy template')
    }
  }
}

export default BuildRepositoryImpl
