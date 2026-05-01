import BuildCommand from './app/build-command'
import CopyTemplateUseCase from './app/copy-template.use-case'

export default async function build() {
  const copyTemplateUseCase = new CopyTemplateUseCase()
  const buildCommand = new BuildCommand(copyTemplateUseCase)
  await buildCommand.execute()
}
