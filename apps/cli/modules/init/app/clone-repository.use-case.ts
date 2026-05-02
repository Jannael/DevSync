import { GREEN } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { DEFAULT_TEMPLATE_URL } from '@/constants/paths'
import type { GitHubRepository } from '../domain/github-repository'

class CloneRepositoryUseCase {
  constructor(private readonly githubRepository: GitHubRepository) {}

  async execute(): Promise<void> {
    console.log(`${SPACE}${GREEN('-')} Cloning default template...`)
    this.githubRepository.cloneRepository(DEFAULT_TEMPLATE_URL)

    console.log(`${SPACE}${CHECK('Default template cloned.')}`)
    console.log('')
  }
}

export default CloneRepositoryUseCase
