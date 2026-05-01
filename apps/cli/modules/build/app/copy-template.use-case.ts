import { GREEN } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { copyDirectory } from '@/shared/infra/copy-directory'
import { TEMPLATE_DIRECTORY } from '@/constants/paths'

class CopyTemplateUseCase {
  async copyTemplate(): Promise<void> {
    console.log(`${SPACE}${GREEN('-')} Copying template files...`)
    await copyDirectory(TEMPLATE_DIRECTORY, process.cwd())
    console.log(`${SPACE}${CHECK('Template ready.')}`)
    console.log('')
  }
}

export default CopyTemplateUseCase
