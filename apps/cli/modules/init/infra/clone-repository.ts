import { ServerError } from '@/error/error-instance'
import type { GitHubRepository } from '../domain/github-repository'
import { execSync } from 'child_process'

export class CloneRepository implements GitHubRepository {
  cloneRepository(url: string): void {
    try {
      execSync(`git clone ${url} .`, { stdio: 'inherit' })
    } catch {
      throw new ServerError('Failed to clone repository')
    }
  }
}
