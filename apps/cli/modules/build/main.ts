import BuildCommand from './app/build-command'
import copyTemplateUseCase from '@/modules/build/app/copy-template.use-case'
import BuildRepositoryImpl from '@/modules/build/infra/build-repository'

export default async function build() {
  const repository = new BuildRepositoryImpl()
  const buildCommand = new BuildCommand(new copyTemplateUseCase(repository))

  await buildCommand.execute()
}
