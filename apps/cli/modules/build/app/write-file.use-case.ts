import type { BuildRepository } from '@/modules/build/domain/build-repository'

class WriteFileUseCase {
  constructor(private readonly buildRepository: BuildRepository) {}

  async execute({ path, data }: { path: string; data: string }): Promise<void> {
    await this.buildRepository.writeFile({ path, data })
  }
}

export default WriteFileUseCase
