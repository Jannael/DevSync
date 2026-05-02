import { CreateGithubProfileMixin } from '@/shared/app/create-github-profile'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { BOLD, GREEN } from '@/utils/colors'
import { errorHandler } from '@/error/error-handler'
import { validateDevsyncMixin } from '@/shared/infra/validate-devsync'
import { createCVMixin } from '@/shared/app/build-cv'
import { CreateAcademicsMixin } from '@/shared/app/create-academics'
import { CreateLinkedinMixin } from '@/shared/app/create-linkedin'
import { devsyncGlobalFields } from '@devsync/src/devsync/devsync'
import { runBunCommand } from '@/utils/run-bun-command'
/*
get defaultLang and languages from cwd
*/

class BaseUpdateCommand {}

class UpdateCommand extends CreateLinkedinMixin(
  CreateAcademicsMixin(
    createCVMixin(CreateGithubProfileMixin(validateDevsyncMixin(BaseUpdateCommand)))
  )
) {
  constructor() {
    super()
  }

  async execute(): Promise<void> {
    try {
      console.log(`${SPACE}${GREEN('-')} Installing dependencies...`)
      await runBunCommand(['install'])
      console.log(`${SPACE}${CHECK(`${BOLD('Dependencies installed.')}`)}`)

      console.log(`${SPACE}${GREEN('-')} Building...`)
      await runBunCommand(['run', 'build'])
      console.log(`${SPACE}${CHECK(`${BOLD('Built successfully.')}`)}`)

      const devsync = await this.validateDevsync()
      const languages = Object.keys(devsync).filter(
        (key) => !devsyncGlobalFields.includes(key as (typeof devsyncGlobalFields)[number])
      )
      const defaultLang = devsync.defaultLang ?? 'en'

      for (const lang of languages) {
        await this.buildCV({ lang })
        await this.createLinkedin({ devsync, lang })
      }
      await this.createGithubProfile({ devsync, defaultLang })
      await this.createAcademics({ devsync, defaultLang })

      console.log(`${SPACE}${CHECK(`${BOLD('Build process completed successfully.')}`)}`)
    } catch (e) {
      errorHandler(e)
    }
  }
}

export default UpdateCommand
