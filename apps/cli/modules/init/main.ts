import { copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { CHECK, SPACE, X } from '@/utils/icons-terminal'
import { BG_YELLOW, BLACK, BOLD, GREEN } from '@/utils/colors'

const TEMPLATE_NAME = 'DEVSYNC.json'
const TEMPLATE_PATH = resolve(import.meta.dir, '..', '..', '..', '..', TEMPLATE_NAME)

export default async function init() {
  const destinationPath = join(process.cwd(), TEMPLATE_NAME)

  if (existsSync(destinationPath)) {
    console.log(`${SPACE}${X(`${TEMPLATE_NAME} already exists in this directory.`)}`)
    console.log('')
    console.log(
      `${SPACE}${BG_YELLOW(BLACK('NOTE:'))} If you already filled this file, run ${BOLD('npx devsync build')}`,
    )
    return
  }

  await copyFile(TEMPLATE_PATH, destinationPath)

  console.log(`${SPACE}${CHECK(`${BOLD(TEMPLATE_NAME)} ${GREEN('created successfully.')}`)}`)
  console.log('')
  console.log(`${SPACE}${GREEN('1.')} Edit ${TEMPLATE_NAME} with you information.`)
  console.log(`${SPACE}${GREEN('2.')} Run ${BOLD('npx devsync build')}`)
}
