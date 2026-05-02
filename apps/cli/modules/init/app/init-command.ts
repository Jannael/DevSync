import { CHECK, SPACE } from '@/utils/icons-terminal'
import { BOLD } from '@/utils/colors'
import { errorHandler } from '@/error/error-handler'
import type CloneRepositoryUseCase from './clone-repository.use-case'

/*
Copy template repository to cwd
*/

class BaseInitCommand {}

class InitCommand extends BaseInitCommand {
  constructor(private readonly cloneRepository: CloneRepositoryUseCase) {
    super()
  }

  async execute(): Promise<void> {
    try {
      await this.cloneRepository.execute()
      console.log(`${SPACE}${CHECK(`${BOLD('Init completed successfully.')}`)}`)
    } catch (e) {
      errorHandler(e)
    }
  }
}

export default InitCommand
