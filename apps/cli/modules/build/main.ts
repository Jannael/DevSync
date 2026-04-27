import BuildCommand from './app/build-command'
import copyTemplateUseCase from '@/modules/build/app/copy-template.use-case'
import createPDFUseCase from '@/modules/build/app/create-pdf.use-case'
import getHTMLFromComponentUseCase from '@/modules/build/app/get-html-from-component.use-case'
import writeFileUseCase from '@/modules/build/app/write-file.use-case'
import createGithubProfileUseCase from '@/modules/build/app/create-github-profile.use-case'
import createAcademicsUseCase from '@/modules/build/app/create-academics.use-case'
import createLinkedinUseCase from '@/shared/infra/create-linkedin.use-case'
import BuildRepositoryImpl from '@/modules/build/infra/build-repository'

export default async function build() {
  const repository = new BuildRepositoryImpl()

  const buildCommand = new BuildCommand(
    new copyTemplateUseCase(repository),
    new createPDFUseCase(repository),
    new getHTMLFromComponentUseCase(repository),
    new writeFileUseCase(repository),
    new createGithubProfileUseCase(repository),
    new createAcademicsUseCase(repository),
    new createLinkedinUseCase(),
  )

  await buildCommand.execute()
}
