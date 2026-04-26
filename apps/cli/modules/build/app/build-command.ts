import copyTemplateUseCase from '@/modules/build/app/copy-template.use-case'
import createPDFUseCase from '@/modules/build/app/create-pdf.use-case'
import getHTMLFromComponentUseCase from '@/modules/build/app/get-html-from-component.use-case'
import readFileUseCase from '@/modules/build/app/read-file.use-case'
import writeFileUseCase from '@/modules/build/app/write-file.use-case'
import { pathCVComponent, pathPDF } from '@/constants/cv-component'
import createGithubProfileUseCase from '@/modules/build/app/create-github-profile.use-case'
import createAcademicsUseCase from '@/modules/build/app/create-academics.use-case'

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
    private readonly readFileUseCase: readFileUseCase,
    private readonly writeFileUseCase: writeFileUseCase,
    private readonly createGithubProfileUseCase: createGithubProfileUseCase,
    private readonly createAcademicsUseCase: createAcademicsUseCase,
  ) {}

  async execute(): Promise<void> {
    // copy template
    await this.copyTemplateUseCase.execute()

    // create pdf from astro component
    const component = await this.readFileUseCase.execute({ path: pathCVComponent })
    const html = await this.getHTMLFromComponentUseCase.execute({ component })
    await this.createPDFUseCase.execute({ html, path: pathPDF })

    // create README
    const README = await this.createGithubProfileUseCase.execute()
    await this.writeFileUseCase.execute({ path: './README.md', data: README })

    // create certifications md
    const academics = await this.createAcademicsUseCase.execute()
    await this.writeFileUseCase.execute({ path: './academics/README.md', data: academics })

    // create linkedin md
  }
}

export default BuildCommand
