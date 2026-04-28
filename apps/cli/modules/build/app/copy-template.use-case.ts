import type { BuildRepository } from '@/modules/build/domain/build-repository'
import { GREEN } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'

class CopyTemplateUseCase {
  constructor(private readonly buildRepository: BuildRepository) {}

  async copyTemplate(): Promise<void> {
    console.log(`${SPACE}${GREEN('1.')} Copying template files...`)
    await this.buildRepository.copyTemplate()
    console.log(`${SPACE}${CHECK('Template ready.')}`)
    console.log('')
  }
}

export default CopyTemplateUseCase
