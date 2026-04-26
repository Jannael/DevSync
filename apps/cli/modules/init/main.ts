import { writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { CHECK, SPACE, X } from '@/utils/icons-terminal'
import { BG_YELLOW, BLACK, BOLD, GREEN } from '@/utils/colors'
import template from '../../../portfolio/DEVSYNC.json'

const TEMPLATE_NAME = 'DEVSYNC.json'

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

  await writeFile(destinationPath, `${JSON.stringify(template, null, 2)}\n`)

  console.log(`${SPACE}${CHECK(`${BOLD(TEMPLATE_NAME)} ${GREEN('created successfully.')}`)}`)
  console.log('')
  console.log(`${SPACE}${GREEN('1.')} Edit ${TEMPLATE_NAME} with you information.`)
  console.log(`${SPACE}${GREEN('2.')} Run ${BOLD('npx devsync build')}`)
}
