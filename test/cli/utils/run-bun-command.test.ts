import { describe, it, expect } from 'vitest'
import { runBunCommand } from '@/utils/run-bun-command.ts'

describe('run-bun-command', () => {
  it('bun --version', async () => {
    const result = await runBunCommand(['--version'])
    expect(result).toBeUndefined()
  })
})
