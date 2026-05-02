import { GREEN } from '@/utils/colors'
import { CHECK, SPACE } from '@/utils/icons-terminal'
import { copyDirectory } from '@/shared/infra/copy-directory'
import { DEVSYNC_DIRECTORY, TEMPLATE_DIRECTORY } from '@/constants/paths'
import { runBunCommand } from '@/utils/run-bun-command'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

/*
HOW IT WORKS:
1. copy the basic template directory (devsync folder)
2. copy the template directory (template folder)
since copy directory command does not overwrites files this is the key for this to work
because portfolio templates will have the same mirrored folders as devsync/
3. install dependencies
4. run 'bun install -E zod@3.25.76' (all templates need zod to validate DEVSYNC.json)
5. run 'bun run build'
6. run 'bun pm set devsync.pathToCompiledCv="./dist/[lang]/index.html" (for buildCV use)
*/

class CopyTemplateUseCase {
  async copyTemplate(): Promise<void> {
    console.log(`${SPACE}${GREEN('-')} Copying template files...`)
    await copyDirectory(DEVSYNC_DIRECTORY, process.cwd())
    await copyDirectory(TEMPLATE_DIRECTORY, process.cwd())
    console.log(`${SPACE}${CHECK('Template files copied.')}`)

    if (!existsSync(resolve(process.cwd(), 'node_modules'))) {
      console.log(`${SPACE}${GREEN('-')} Installing dependencies...`)
      await runBunCommand(['install'])
    }

    console.log(`${SPACE}${GREEN('-')} Installing zod...`)
    await runBunCommand(['install', '-E', 'zod@3.25.76'])

    console.log(`${SPACE}${GREEN('-')} Building template...`)
    await runBunCommand(['run', 'build'])

    console.log(`${SPACE}${GREEN('-')} Configuring devsync...`)
    await runBunCommand([
      'pm',
      'pkg',
      'set',
      'devsync.pathToCompiledCv="./dist/[lang]/cv/index.html"',
    ])

    console.log(`${SPACE}${CHECK('Template ready.')}`)
    console.log('')
  }
}

export default CopyTemplateUseCase
