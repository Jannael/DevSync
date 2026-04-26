import type { BuildRepository } from '../domain/build-repository'

class GetHTMLFromComponentUseCase {
  constructor(private readonly buildRepository: BuildRepository) {}

  async execute({ component }: { component: string }): Promise<string> {
    return await this.buildRepository.getHTMLFromComponent({ component })
  }
}

export default GetHTMLFromComponentUseCase