import copyTemplateUseCase from '@/modules/build/app/copy-template.use-case'
import { pathAcademics, pathCvPDF, pathREADME, pathLinkedin } from '@/constants/paths'
import createGithubProfileUseCase from '@/shared/app/create-github-profile.use-case'
import createAcademicsUseCase from '@/shared/app/create-academics'
import createLinkedinUseCase from '@/shared/app/create-linkedin'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { BOLD, GREEN } from '@/utils/colors'
import { writeFileMixin } from '@/shared/infra/write-file'
import { createPDFMixin } from '@/shared/infra/create-pdf'
import { getHTMLFromCVComponentMixin } from '@/shared/infra/get-html-from-cv-component'
import { errorHandler } from '@/error/error-handler'
import { validateDevsyncMixin } from '@/shared/infra/validate-devsync'
import type { DevsyncPartial } from '@template/src/devsync-validator'

/*
To build the project this is how it works
1. Copy the template in the current directory (portfolio), where the DEVSYNC.json is.
2. Compile CV.astro component to static html.
3. Use puppeteer to convert the static html to pdf (CV).
4. Create README.md (Github Profile).
5. Create LinkedIn.md (LinkedIn Profile).
*/

class BaseBuildCommand {}

class BuildCommand extends writeFileMixin(
  createPDFMixin(getHTMLFromCVComponentMixin(validateDevsyncMixin(BaseBuildCommand))),
) {
  constructor(
    private readonly copyTemplateUseCase: copyTemplateUseCase,
    private readonly createGithubProfileUseCase: createGithubProfileUseCase,
    private readonly createAcademicsUseCase: createAcademicsUseCase,
    private readonly createLinkedinUseCase: createLinkedinUseCase,
  ) {
    super()
  }

  async execute(): Promise<void> {
    try {
      const devsync = await this.validateDevsync()
      await this.copyTemplate()
      await this.buildCV()
      await this.createGithubProfile({ devsync })
      await this.createAcademics({ devsync })
      await this.createLinkedin({ devsync })

      console.log(`${SPACE}${CHECK(`${BOLD('Build completed successfully.')}`)}`)
    } catch (e) {
      errorHandler(e)
    }
  }

  private async copyTemplate() {
    console.log(`${SPACE}${GREEN('1.')} Copying template files...`)
    await this.copyTemplateUseCase.execute()
    console.log(`${SPACE}${CHECK('Template ready.')}`)
    console.log('')
  }

  private async buildCV() {
    console.log(`${SPACE}${GREEN('2.')} Building CV and generating PDF...`)
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

export default BuildCommand
