import BuildCommand from './app/build-command'
import copyTemplateUseCase from '@/modules/build/app/copy-template.use-case'
import createGithubProfileUseCase from '@/shared/app/create-github-profile.use-case'
import createAcademicsUseCase from '@/shared/app/create-academics.use-case'
import createLinkedinUseCase from '@/shared/app/create-linkedin.use-case'
import BuildRepositoryImpl from '@/modules/build/infra/build-repository'

export default async function build() {
  const repository = new BuildRepositoryImpl()

  const buildCommand = new BuildCommand(
    new copyTemplateUseCase(repository),
    new createGithubProfileUseCase(),
    new createAcademicsUseCase(),
    new createLinkedinUseCase(),
  )

  await buildCommand.execute()
}
