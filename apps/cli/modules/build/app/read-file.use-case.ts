import type { BuildRepository } from '../domain/build-repository'

class ReadFileUseCase {
  constructor(private readonly buildRepository: BuildRepository) {}

  async execute({ path }: { path: string }): Promise<string> {
    return await this.buildRepository.readFile({ path })
  }
}

export default ReadFileUseCase
