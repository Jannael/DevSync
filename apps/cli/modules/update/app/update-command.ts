import { pathLinkedin } from '@/constants/paths'
import { CreateGithubProfileMixin } from '@/shared/app/create-github-profile'
import createLinkedinUseCase from '@/shared/app/create-linkedin.use-case'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { BOLD, GREEN } from '@/utils/colors'
import { writeFileMixin } from '@/shared/infra/write-file'
import { errorHandler } from '@/error/error-handler'
import { validateDevsyncMixin } from '@/shared/infra/validate-devsync'
import type { DevsyncPartial } from '@template/src/devsync-validator'
import { createCVMixin } from '@/shared/app/build-cv'
import { CreateAcademicsMixin } from '@/shared/app/create-academics'

/*
IMPORTANT: the portfolio must have a github action to run `devsync update` every time the users pushes to main branch.

Devsync update:
since the user should be able to change the style of cv and portfolio, update function won't modify or update the portfolio where the cv component is. Only will update Linkedin.md, README.md and create the CV pdf file.

The idea is the user to deploy his portfolio with vercel or cloudflare or netlify or any of those serverless providers, so when the user makes a push to the repo the provider will build and deploy the portfolio automatically. Like this everything is covered, portfolio, CV(will only create the pdf file not the cv component), Linkedin.md and README.md (these two will be overwritten).
*/

class BaseUpdateCommand {}

class UpdateCommand extends CreateAcademicsMixin(createCVMixin(
  CreateGithubProfileMixin(writeFileMixin(validateDevsyncMixin(BaseUpdateCommand)))),
) {
  constructor(private readonly createLinkedinUseCase: createLinkedinUseCase) {
    super()
  }

  async execute(): Promise<void> {
    try {
      const devsync = await this.validateDevsync()
      await this.buildCV()
      await this.createGithubProfile({ devsync })
      await this.createAcademics({ devsync })
      await this.createLinkedin({ devsync })

      console.log(`${SPACE}${CHECK(`${BOLD('Build completed successfully.')}`)}`)
    } catch (e) {
      errorHandler(e)
    }
  }

  private async createLinkedin({ devsync }: { devsync: DevsyncPartial }) {
    console.log(`${SPACE}${GREEN('5.')} Generating LinkedIn presentation...`)
    const linkedin = await this.createLinkedinUseCase.execute({ devsync })
    await this.writeFile({ path: pathLinkedin, data: linkedin })
    console.log(`${SPACE}${CHECK(`LinkedIn markdown generated at ${BOLD(pathLinkedin)}`)}`)
    console.log('')
  }
}

export default UpdateCommand
