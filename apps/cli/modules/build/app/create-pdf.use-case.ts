import type { BuildRepository } from '@/modules/build/domain/build-repository'

class CreatePDFUseCase {
  constructor(private readonly buildRepository: BuildRepository) {}

  async execute({ html, path }: { html: string; path: string }): Promise<void> {
    await this.buildRepository.createPDF({ html, path })
  }
}

export default CreatePDFUseCase
