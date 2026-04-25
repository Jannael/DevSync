import { copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { CHECK, SPACE, X } from '@/utils/icons-terminal'

const TEMPLATE_NAME = 'DEVSYNC.json'
const TEMPLATE_PATH = resolve(import.meta.dir, '..', '..', '..', '..', TEMPLATE_NAME)

export default async function init() {
  const destinationPath = join(process.cwd(), TEMPLATE_NAME)

  if (existsSync(destinationPath)) {
    console.log(`${SPACE}${X(`${TEMPLATE_NAME} already exists in this directory.`)}`)
    return
  }

  await copyFile(TEMPLATE_PATH, destinationPath)

  console.log(`${SPACE}${CHECK(`${TEMPLATE_NAME} created successfully.`)}`)
}
