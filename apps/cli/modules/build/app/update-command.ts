import { CreateGithubProfileMixin } from '@/shared/app/create-github-profile'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { BOLD } from '@/utils/colors'
import { errorHandler } from '@/error/error-handler'
import { validateDevsyncMixin } from '@/shared/infra/validate-devsync'
import { createCVMixin } from '@/shared/app/build-cv'
import { CreateAcademicsMixin } from '@/shared/app/create-academics'
import { CreateLinkedinMixin } from '@/shared/app/create-linkedin'
import { defaultLang, languages } from '@devsync/src/devsync/devsync'

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
      const devsync = await this.validateDevsync()
      for (const lang of languages) {
        await this.buildCV({ lang })
        await this.createLinkedin({ devsync, lang })
      }
      await this.createGithubProfile({ devsync, defaultLang })
      await this.createAcademics({ devsync, defaultLang })

      console.log(`${SPACE}${CHECK(`${BOLD('Updated successfully.')}`)}`)
    } catch (e) {
      errorHandler(e)
    }
  }
}

export default UpdateCommand
