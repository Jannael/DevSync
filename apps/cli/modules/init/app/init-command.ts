import { CHECK, SPACE } from '@/utils/icons-terminal'
import { BOLD, GREEN } from '@/utils/colors'
import { errorHandler } from '@/error/error-handler'
import type CloneRepositoryUseCase from './clone-repository.use-case'
import PrintASCII from '@/ascii'

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
      PrintASCII()

      await this.cloneRepository.execute()
      console.log(`${SPACE}${CHECK(`${BOLD('Init completed successfully.')}`)}`)

      console.log(`${SPACE}${GREEN('1.')}${BOLD('Fill DEVSYNC.json with your information')}`)
      console.log(`${SPACE}${GREEN('2.')}${BOLD('Create a repository with your username')}`)
      console.log(
        `${SPACE}${GREEN('3.')}Run ${BOLD('git remote add origin https://github.com/[username]/[username].git')}`
      )
    } catch (e) {
      errorHandler(e)
    }
  }
}

export default InitCommand
