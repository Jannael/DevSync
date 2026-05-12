import InitCommand from '@/modules/init/app/init-command'
import CopyTemplateUseCase from '@/modules/init/app/clone-repository.use-case'
import { CloneRepository } from '@/modules/init/infra/clone-repository'

export default async function build(args: string[]) {
  const cloneRepositoryUseCase = new CopyTemplateUseCase(new CloneRepository())
  const initCommand = new InitCommand(cloneRepositoryUseCase)
  await initCommand.execute(args)
}
