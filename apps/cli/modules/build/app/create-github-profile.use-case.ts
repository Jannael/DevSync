import type { BuildRepository } from '@/modules/build/domain/build-repository'

class CreateGithubProfileUseCase {
  constructor(private readonly buildRepository: BuildRepository) {}

  async execute() {
    
  }
}

export default CreateGithubProfileUseCase
