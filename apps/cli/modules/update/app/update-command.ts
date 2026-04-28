import { CreateGithubProfileMixin } from '@/shared/app/create-github-profile'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { BOLD } from '@/utils/colors'
import { errorHandler } from '@/error/error-handler'
import { validateDevsyncMixin } from '@/shared/infra/validate-devsync'
import { createCVMixin } from '@/shared/app/build-cv'
import { CreateAcademicsMixin } from '@/shared/app/create-academics'
import { CreateLinkedinMixin } from '@/shared/app/create-linkedin'

/*
IMPORTANT: the portfolio must have a github action to run `devsync update` every time the users pushes to main branch.

Devsync update:
since the user should be able to change the style of cv and portfolio, update function won't modify or update the portfolio where the cv component is. Only will update Linkedin.md, README.md and create the CV pdf file.

The idea is the user to deploy his portfolio with vercel or cloudflare or netlify or any of those serverless providers, so when the user makes a push to the repo the provider will build and deploy the portfolio automatically. Like this everything is covered, portfolio, CV(will only create the pdf file not the cv component), Linkedin.md and README.md (these two will be overwritten).
*/

class BaseUpdateCommand {}

class UpdateCommand extends CreateLinkedinMixin(
  CreateAcademicsMixin(
    createCVMixin(CreateGithubProfileMixin(validateDevsyncMixin(BaseUpdateCommand))),
  ),
) {
  constructor() {
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
}

export default UpdateCommand
