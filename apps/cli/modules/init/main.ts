import InitCommand from './app/init-command'
import CopyTemplateUseCase from './app/clone-repository.use-case'
import { CloneRepository } from './infra/clone-repository'

export default async function build() {
  const cloneRepositoryUseCase = new CopyTemplateUseCase(new CloneRepository())
  const initCommand = new InitCommand(cloneRepositoryUseCase)
  await initCommand.execute()
}
