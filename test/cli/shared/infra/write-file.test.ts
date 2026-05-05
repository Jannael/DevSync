import { describe, it, expect, vi, beforeEach } from 'vitest'
import { writeFileMixin } from '@/shared/infra/write-file'
import { mkdir, writeFile as fsWriteFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'

vi.mock('node:fs/promises', () => ({
  mkdir: vi.fn(),
  writeFile: vi.fn(),
}))

const mockMkdir = vi.mocked(mkdir)
const mockWriteFile = vi.mocked(fsWriteFile)

class Base {}
const WriteFileClass = writeFileMixin(Base)

describe('writeFileMixin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('create directory and write file', async () => {
    mockMkdir.mockResolvedValue(undefined)
    mockWriteFile.mockResolvedValue(undefined)

    const instance = new WriteFileClass()
    await instance.writeFile({ path: 'output/file.txt', data: 'hello world' })

    const fullPath = resolve(process.cwd(), 'output/file.txt')

    expect(mockMkdir).toHaveBeenCalledWith(dirname(fullPath), { recursive: true })
    expect(mockWriteFile).toHaveBeenCalledWith(fullPath, 'hello world', 'utf8')
  })

  it('resolve the path relative to cwd', async () => {
    mockMkdir.mockResolvedValue(undefined)
    mockWriteFile.mockResolvedValue(undefined)

    const instance = new WriteFileClass()
    await instance.writeFile({ path: 'some/nested/path/file.json', data: '{}' })

    const expected = resolve(process.cwd(), 'some/nested/path/file.json')
    expect(mockWriteFile).toHaveBeenCalledWith(expected, '{}', 'utf8')
  })

  it('ServerError when mkdir fails', async () => {
    mockMkdir.mockRejectedValue(new Error('permission denied'))

    const instance = new WriteFileClass()

    await expect(instance.writeFile({ path: 'output/file.txt', data: 'data' })).rejects.toThrow(
      'Failed to write file'
    )
  })

  it('ServerError when writeFile fails', async () => {
    mockMkdir.mockResolvedValue(undefined)
    mockWriteFile.mockRejectedValue(new Error('disk full'))

    const instance = new WriteFileClass()

    await expect(instance.writeFile({ path: 'output/file.txt', data: 'data' })).rejects.toThrow(
      'Failed to write file'
    )
  })

  it('mixin is applied on top of another class', async () => {
    mockMkdir.mockResolvedValue(undefined)
    mockWriteFile.mockResolvedValue(undefined)

    class CustomBase {
      greet() {
        return 'hello'
      }
    }

    const Mixed = writeFileMixin(CustomBase)
    const instance = new Mixed()

    expect(instance.greet()).toBe('hello')
    await expect(instance.writeFile({ path: 'file.txt', data: 'test' })).resolves.toBeUndefined()
  })
})
