import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getHTMLMixin } from '@/shared/infra/get-html'
import { readFile as fsReadFile } from 'node:fs/promises'

vi.mock('@/constants/paths', () => ({
  CWD_PACKAGE_JSON: '/mock/package.json',
}))

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
}))

vi.mock('node:fs', () => ({
  existsSync: vi.fn(() => true),
}))

const mockFsReadFile = vi.mocked(fsReadFile)

describe('getHTML from cv component Mixin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mixin is applied on top of another class', async () => {
    mockFsReadFile.mockResolvedValue('<h1> DEVSYNC </h1>')

    class CustomBase {
      greet() {
        return 'hello'
      }
    }

    const Mixed = getHTMLMixin(CustomBase)
    const instance = new Mixed()

    expect(instance.greet()).toBe('hello')
  })
})
