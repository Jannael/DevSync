import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runBunCommand } from '@/utils/run-bun-command.ts'
import { spawn } from 'node:child_process'
import { EventEmitter } from 'node:events'

vi.mock('node:child_process', () => ({
  spawn: vi.fn(),
}))

const mockSpawn = vi.mocked(spawn)

const createChildMock = () => {
  const child = new EventEmitter() as EventEmitter & { stdin: null }
  child.stdin = null
  return child
}

describe('runBunCommand', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('resolve when exit code is 0', async () => {
    const child = createChildMock()
    mockSpawn.mockReturnValue(child as any)

    const promise = runBunCommand(['install'])
    child.emit('exit', 0)

    await expect(promise).resolves.toBeUndefined()
  })

  it('throw ServerError when exit code is not 0', async () => {
    const child = createChildMock()
    mockSpawn.mockReturnValue(child as any)

    const promise = runBunCommand(['install'])
    child.emit('exit', 1)

    await expect(promise).rejects.toThrow('Failed to run bun command')
  })

  it('throw ServerError when spawn emits error', async () => {
    const child = createChildMock()
    mockSpawn.mockReturnValue(child as any)

    const promise = runBunCommand(['install'])
    child.emit('error', new Error('spawn error'))

    await expect(promise).rejects.toThrow('Failed to run bun command')
  })

  it('call spawn with correct args', async () => {
    const child = createChildMock()
    mockSpawn.mockReturnValue(child as any)

    const promise = runBunCommand(['add', 'zod'])
    child.emit('exit', 0)
    await promise

    expect(mockSpawn).toHaveBeenCalledWith('bun', ['add', 'zod'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true,
    })
  })
})
