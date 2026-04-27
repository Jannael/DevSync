import type { BuildRepository } from '@/modules/build/domain/build-repository'

class GetHTMLFromComponentUseCase {
  constructor(private readonly buildRepository: BuildRepository) {}

  async execute(): Promise<string> {
    return await this.buildRepository.getHTMLFromComponent()
  }
}

export default GetHTMLFromComponentUseCase