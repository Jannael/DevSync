import type { BuildRepository as IBuildRepository } from '../domain/build-repository'
import { cp, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { readFileMixin } from '@/shared/infra/read-file'
import { TEMPLATE_DIRECTORY, DEVSYNC_JSON_PATH } from '@/constants/paths'
import { ServerError } from '@/error/error-instance'
import { SPACE, X } from '@/utils/icons-terminal'
import { BOLD, GREEN } from '@/utils/colors'

class BaseRepo {}

class BuildRepository extends readFileMixin(BaseRepo) implements IBuildRepository {
  validateDevsyncJSONInCWD(): void {
    if (existsSync(DEVSYNC_JSON_PATH)) {
      return
    }

    console.log(`${SPACE}${X('DEVSYNC.json not found in this directory.')}`)
    console.log('')
    console.log(`${SPACE}${GREEN('1.')} Run ${BOLD('devsync init')}`)
    console.log(`${SPACE}${GREEN('2.')} Fill ${BOLD('DEVSYNC.json')} with your information`)
    console.log(`${SPACE}${GREEN('3.')} Run ${BOLD('devsync build')}`)
    process.exit(1)
  }

  async copyTemplate(): Promise<void> {
    this.validateDevsyncJSONInCWD()

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
      console.error(new ServerError('Build command failed'))
      process.exit(1)
    }
  }
}

export const BuildRepositoryImpl = readFileMixin(BuildRepository)

export default BuildRepositoryImpl
