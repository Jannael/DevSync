import BuildCommand from './app/build-command'
import CopyTemplateUseCase from '@/modules/build/app/copy-template.use-case'
import BuildRepositoryImpl from '@/modules/build/infra/build-repository'

export default async function build() {
  const repository = new BuildRepositoryImpl()
  const copyTemplateUseCase = new CopyTemplateUseCase(repository)
  const buildCommand = new BuildCommand(copyTemplateUseCase)
  await buildCommand.execute()
}
