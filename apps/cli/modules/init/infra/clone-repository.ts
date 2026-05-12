import { ServerError } from '@/error/error-instance'
import type { GitHubRepository } from '@/modules/init/domain/github-repository'
import { execSync } from 'child_process'
import { SPACE } from '@/utils/icons-terminal'

export class CloneRepository implements GitHubRepository {
  cloneRepository(url: string): void {
    try {
      execSync(`git clone ${url} . --depth 1`, { stdio: 'inherit' })
      execSync(`git remote remove origin`, { stdio: 'inherit' })
    } catch {
      throw new ServerError(
        'Failed to clone repository',
        `${SPACE}${SPACE}Check your internet connection.\n` +
          `${SPACE}${SPACE}Ensure git is installed and accessible.`
      )
    }
  }
}
