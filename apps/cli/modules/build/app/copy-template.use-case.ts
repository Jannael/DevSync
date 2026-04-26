import type { BuildRepository } from '../domain/build-repository'

class CopyTemplateUseCase {
  constructor(private readonly buildRepository: BuildRepository) {}

  async execute(): Promise<void> {
    await this.buildRepository.copyTemplate()
  }
}

export default CopyTemplateUseCase
