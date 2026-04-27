import copyTemplateUseCase from '@/modules/build/app/copy-template.use-case'
import createPDFUseCase from '@/modules/build/app/create-pdf.use-case'
import getHTMLFromComponentUseCase from '@/modules/build/app/get-html-from-component.use-case'
import writeFileUseCase from '@/modules/build/app/write-file.use-case'
import { pathPDF } from '@/constants/cv-component'
import createGithubProfileUseCase from '@/modules/build/app/create-github-profile.use-case'
import createAcademicsUseCase from '@/shared/infra/create-academics.use-case'
import createLinkedinUseCase from '@/shared/infra/create-linkedin.use-case'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { BOLD, GREEN } from '@/utils/colors'

/*
To build the project this is how it works
1. Copy the template in the current directory (portfolio), where the DEVSYNC.json is.
2. Compile CV.astro component to static html.
3. Use puppeteer to convert the static html to pdf (CV).
4. Create README.md (Github Profile).
5. Create LinkedIn.md (LinkedIn Profile).
*/

class BuildCommand {
  constructor(
    private readonly copyTemplateUseCase: copyTemplateUseCase,
    private readonly createPDFUseCase: createPDFUseCase,
    private readonly getHTMLFromComponentUseCase: getHTMLFromComponentUseCase,
    private readonly writeFileUseCase: writeFileUseCase,
    private readonly createGithubProfileUseCase: createGithubProfileUseCase,
    private readonly createAcademicsUseCase: createAcademicsUseCase,
    private readonly createLinkedinUseCase: createLinkedinUseCase,
  ) {}

  async execute(): Promise<void> {
    console.log(`${SPACE}${GREEN('1.')} Copying template files...`)
    // copy template
    await this.copyTemplateUseCase.execute()
    console.log(`${SPACE}${CHECK('Template ready.')}`)
    console.log('')

    console.log(`${SPACE}${GREEN('2.')} Building CV and generating PDF...`)
    // create pdf from astro component
    const html = await this.getHTMLFromComponentUseCase.execute({ component: 'cv' })
    await this.createPDFUseCase.execute({ html, path: pathPDF })
    console.log(`${SPACE}${CHECK(`CV generated at ${BOLD(pathPDF)}`)}`)
    console.log('')

    console.log(`${SPACE}${GREEN('3.')} Generating GitHub profile README...`)
    // create README
    const README = await this.createGithubProfileUseCase.execute()
    await this.writeFileUseCase.execute({ path: './README.md', data: README })
    console.log(`${SPACE}${CHECK(`README generated at ${BOLD('./README.md')}`)}`)
    console.log('')

    console.log(`${SPACE}${GREEN('4.')} Generating academics README...`)
    // create certifications md
    const academics = await this.createAcademicsUseCase.execute()
    await this.writeFileUseCase.execute({ path: './academics/README.md', data: academics })
    console.log(`${SPACE}${CHECK(`Academics file generated at ${BOLD('./academics/README.md')}`)}`)
    console.log('')

    console.log(`${SPACE}${GREEN('5.')} Generating LinkedIn presentation...`)
    // create linkedin md
    const linkedin = await this.createLinkedinUseCase.execute()
    await this.writeFileUseCase.execute({ path: './linkedin.md', data: linkedin })
    console.log(`${SPACE}${CHECK(`LinkedIn markdown generated at ${BOLD('./linkedin.md')}`)}`)
    console.log('')

    console.log(`${SPACE}${CHECK(`${BOLD('Build completed successfully.')}`)}`)
  }
}

export default BuildCommand
