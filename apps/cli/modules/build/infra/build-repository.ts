import type { BuildRepository as IBuildRepository } from '../domain/build-repository'
import {
  cp,
  readdir,
} from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { readFileMixin } from '@/shared/infra/read-file'

const TEMPLATE_DIRECTORY = resolve(import.meta.dir, '..', '..', '..', '..', 'template')

class BaseRepo {}

class BuildRepository extends readFileMixin(BaseRepo) implements IBuildRepository {
  async copyTemplate(): Promise<void> {
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
  }
}

export const BuildRepositoryImpl = readFileMixin(BuildRepository)

export default BuildRepositoryImpl
