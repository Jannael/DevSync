import { GREEN } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import type { GitHubRepository } from '@/modules/init/domain/github-repository'

class CloneRepositoryUseCase {
  constructor(private readonly githubRepository: GitHubRepository) {}

  async execute(template: string): Promise<void> {
    console.log(`${SPACE}${GREEN('-')} Cloning default template...`)
    this.githubRepository.cloneRepository(template)

    console.log(`${SPACE}${CHECK('Default template cloned.')}`)
    console.log('')
  }
}

export default CloneRepositoryUseCase
