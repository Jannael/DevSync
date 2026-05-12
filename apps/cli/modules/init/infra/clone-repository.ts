import { ServerError } from '@/error/error-instance'
import type { GitHubRepository } from '@/modules/init/domain/github-repository'
import { spawnSync } from 'child_process'
import { rmSync } from 'fs'
import { SPACE } from '@/utils/icons-terminal'

function run(cmd: string, args: string[]) {
  const r = spawnSync(cmd, args, { stdio: 'inherit' })
  if (r.status !== 0) process.exit(r.status ?? 1)
}

export class CloneRepository implements GitHubRepository {
  cloneRepository(url: string): void {
    try {
      run('git', ['clone', '--depth', '1', url, '.'])
      rmSync('.git', { recursive: true, force: true }) // remove template git metadata
      run('git', ['init', '-b', 'main'])
      run('git', ['add', '.'])
      run('git', ['commit', '-m', 'Initial commit'])
    } catch {
      throw new ServerError(
        'Failed to clone repository',
        `${SPACE}${SPACE}Check your internet connection.\n` +
          `${SPACE}${SPACE}Ensure git is installed and accessible.`
      )
    }
  }
}
