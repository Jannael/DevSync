import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileMixin } from '@/shared/infra/read-file'
import { readFile as fsReadFile } from 'node:fs/promises'

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
}))

const mockFsReadFile = vi.mocked(fsReadFile)

describe('readFileMixin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mixin is applied on top of another class', async () => {
    mockFsReadFile.mockResolvedValue('hello world')

    class CustomBase {
      greet() {
        return 'hello'
      }
    }

    const Mixed = readFileMixin(CustomBase)
    const instance = new Mixed()

    expect(instance.greet()).toBe('hello')
    await expect(instance.readFile({ path: 'file.txt' })).resolves.toBe('hello world')
  })
})
