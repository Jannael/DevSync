import { pathAcademics, pathCvPDF, pathREADME, pathLinkedin } from '@/constants/paths'
import createGithubProfileUseCase from '@/shared/app/create-github-profile.use-case'
import createAcademicsUseCase from '@/shared/app/create-academics.use-case'
import createLinkedinUseCase from '@/shared/app/create-linkedin.use-case'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { BOLD, GREEN } from '@/utils/colors'
import { writeFileMixin } from '@/shared/infra/write-file'
import { createPDFMixin } from '@/shared/infra/create-pdf'
import { getHTMLFromCVComponentMixin } from '@/shared/infra/get-html-from-cv-component'
import { errorHandler } from '@/error/error-handler'
import { validateDevsyncMixin } from '@/shared/infra/validate-devsync'
import type { DevsyncPartial } from '@template/src/devsync-validator'

/*
IMPORTANT: the portfolio must have a github action to run `devsync update` every time the users pushes to main branch.

Devsync update:
since the user should be able to change the style of cv and portfolio, update function won't modify or update the portfolio where the cv component is. Only will update Linkedin.md, README.md and create the CV pdf file.

The idea is the user to deploy his portfolio with vercel or cloudflare or netlify or any of those serverless providers, so when the user makes a push to the repo the provider will build and deploy the portfolio automatically. Like this everything is covered, portfolio, CV(will only create the pdf file not the cv component), Linkedin.md and README.md (these two will be overwritten).
*/

class BaseUpdateCommand {}

class UpdateCommand extends writeFileMixin(
  createPDFMixin(getHTMLFromCVComponentMixin(validateDevsyncMixin(BaseUpdateCommand))),
) {
  constructor(
    private readonly createGithubProfileUseCase: createGithubProfileUseCase,
    private readonly createAcademicsUseCase: createAcademicsUseCase,
    private readonly createLinkedinUseCase: createLinkedinUseCase,
  ) {
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

  private async buildCV() {
    console.log(`${SPACE}${GREEN('1.')} Building CV and generating PDF...`)
    const html = await this.getHTMLFromCvComponent()
    await this.createPDF({ html, path: pathCvPDF })
    console.log(`${SPACE}${CHECK(`CV generated at ${BOLD(pathCvPDF)}`)}`)
    console.log('')
  }

  private async createGithubProfile({ devsync }: { devsync: DevsyncPartial }) {
    console.log(`${SPACE}${GREEN('3.')} Generating GitHub profile README...`)
    const README = await this.createGithubProfileUseCase.execute({ devsync })
    await this.writeFile({ path: pathREADME, data: README })
    console.log(`${SPACE}${CHECK(`README generated at ${BOLD(pathREADME)}`)}`)
    console.log('')
  }

  private async createAcademics({ devsync }: { devsync: DevsyncPartial }) {
    console.log(`${SPACE}${GREEN('4.')} Generating academics README...`)
    // create certifications md
    const academics = await this.createAcademicsUseCase.execute({ devsync })
    await this.writeFile({ path: pathAcademics, data: academics })
    console.log(`${SPACE}${CHECK(`Academics file generated at ${BOLD(pathAcademics)}`)}`)
    console.log('')
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
