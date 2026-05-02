import { CHECK, SPACE } from '@/utils/icons-terminal'
import { BOLD, GREEN } from '@/utils/colors'
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

      console.log(`${SPACE}${GREEN('1.')}${BOLD('create a repository with your username')}`)
      console.log(
        `${SPACE}${GREEN('2.')}${BOLD('run git add remote https://github.com/[username]/[username].git')}`
      )
    } catch (e) {
      errorHandler(e)
    }
  }
}

export default InitCommand
