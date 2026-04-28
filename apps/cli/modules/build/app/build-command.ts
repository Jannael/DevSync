import copyTemplateUseCase from '@/modules/build/app/copy-template.use-case'
import { CreateGithubProfileMixin } from '@/shared/app/create-github-profile'
import { CreateAcademicsMixin } from '@/shared/app/create-academics'
import { CreateLinkedinMixin } from '@/shared/app/create-linkedin'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { BOLD, GREEN } from '@/utils/colors'
import { writeFileMixin } from '@/shared/infra/write-file'
import { createPDFMixin } from '@/shared/infra/create-pdf'
import { getHTMLFromCVComponentMixin } from '@/shared/infra/get-html-from-cv-component'
import { errorHandler } from '@/error/error-handler'
import { validateDevsyncMixin } from '@/shared/infra/validate-devsync'
import { createCVMixin } from '@/shared/app/build-cv'

/*
To build the project this is how it works
1. Copy the template in the current directory (portfolio), where the DEVSYNC.json is.
2. Compile CV.astro component to static html.
3. Use puppeteer to convert the static html to pdf (CV).
4. Create README.md (Github Profile).
5. Create LinkedIn.md (LinkedIn Profile).
*/

class BaseBuildCommand {}

class BuildCommand extends createCVMixin(
  CreateLinkedinMixin(
    CreateAcademicsMixin(
      CreateGithubProfileMixin(
        writeFileMixin(
          createPDFMixin(getHTMLFromCVComponentMixin(validateDevsyncMixin(BaseBuildCommand))),
        ),
      ),
    ),
  ),
) {
  constructor(private readonly copyTemplateUseCase: copyTemplateUseCase) {
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
}

export default BuildCommand
