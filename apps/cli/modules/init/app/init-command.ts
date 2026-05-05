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

      console.log(`${SPACE}${GREEN('1.')}${BOLD('Create a repository with your username')}`)
      console.log(
        `${SPACE}${GREEN('2.')}Run ${BOLD('git remote add origin https://github.com/[username]/[username].git')}`
      )
      console.log(`${SPACE}${GREEN('3.')}${BOLD('Push')} your project`)
      console.log(
        `${SPACE}${GREEN('4.')}${BOLD('Fill DEVSYNC.json')} with your information and ${BOLD('push your changes')}`
      )
    } catch (e) {
      errorHandler(e)
    }
  }
}

export default InitCommand
