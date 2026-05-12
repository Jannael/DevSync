import { copyDirectory } from '@/shared/infra/copy-directory'
import { DEVSYNC_DIRECTORY } from '@/constants/paths'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import PrintASCII from '@/ascii'
import { existsSync } from 'fs'
import { BOLD, YELLOW } from '@/utils/colors'

export default async function createTemplate() {
  PrintASCII()
  let message: string | undefined
  console.log(`${SPACE}Creating template...`)

  if (existsSync('./package.json')) {
    message = `\n${SPACE}- ${YELLOW('you need to install zod')} run ${BOLD('npm i zod@3.25.76 -E')}`
  }

  await copyDirectory(DEVSYNC_DIRECTORY, process.cwd())
  console.log(`${SPACE}${CHECK('Template created successfully!')}`)
  if (message) console.log(message)
}
