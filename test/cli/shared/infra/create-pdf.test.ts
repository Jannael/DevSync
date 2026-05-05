import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPDFMixin } from '@/shared/infra/create-pdf'

const mockLaunch = vi.fn()

vi.mock('puppeteer', () => ({
  default: {
    launch: (...args: unknown[]) => mockLaunch(...args),
  },
}))

describe('createPDFMixin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mixin is applied on top of another class', async () => {
    const mockPage = {
      setContent: vi.fn().mockResolvedValue(undefined),
      emulateMediaType: vi.fn().mockResolvedValue(undefined),
      pdf: vi.fn().mockResolvedValue(undefined),
    }
    const mockBrowser = {
      newPage: vi.fn().mockResolvedValue(mockPage),
      close: vi.fn().mockResolvedValue(undefined),
    }
    mockLaunch.mockResolvedValue(mockBrowser)

    class CustomBase {
      greet() {
        return 'hello'
      }
    }

    const Mixed = createPDFMixin(CustomBase)
    const instance = new Mixed()

    expect(instance.greet()).toBe('hello')
    await instance.createPDF({ html: '<h1>Test</h1>', path: 'output.pdf' })

    expect(mockLaunch).toHaveBeenCalledOnce()
    expect(mockBrowser.newPage).toHaveBeenCalledOnce()
    expect(mockBrowser.close).toHaveBeenCalledOnce()
  })

  it('throws ServerError when puppeteer fails', async () => {
    mockLaunch.mockRejectedValue(new Error('Puppeteer launch failed'))

    class CustomBase {}

    const Mixed = createPDFMixin(CustomBase)
    const instance = new Mixed()

    await expect(instance.createPDF({ html: '<h1>Test</h1>', path: 'output.pdf' })).rejects.toThrow(
      'Failed to create PDF'
    )
  })
})
