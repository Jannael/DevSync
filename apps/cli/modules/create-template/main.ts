import { copyDirectory } from '@/shared/infra/copy-directory'
import { DEVSYNC_DIRECTORY } from '@/constants/paths'
import { CHECK, SPACE } from '@/utils/icons-terminal'

export default async function createTemplate() {
  console.log(`${SPACE}Creating template...`)
  await copyDirectory(DEVSYNC_DIRECTORY, process.cwd())
  console.log(`${SPACE}${CHECK('Template created successfully!')}`)
}
