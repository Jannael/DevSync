import type { BuildRepository } from '@/modules/build/domain/build-repository'
import { cp, mkdir, readFile as fsReadFile, readdir, writeFile as fsWriteFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'

const TEMPLATE_DIRECTORY = resolve(import.meta.dir, '..', '..', '..', '..', 'template')
const CWD_PACKAGE_JSON_PATH = resolve(process.cwd(), 'package.json')

const runBunCommand = async (args: string[]) => {
  await new Promise<void>((resolvePromise, reject) => {
    const child = spawn('bun', args, {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true,
    })

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolvePromise()
        return
      }

      reject(new Error(`bun ${args.join(' ')} failed with exit code ${code ?? 'unknown'}`))
    })
  })
}

class BuildRepositoryImpl implements BuildRepository {
  async copyTemplate(): Promise<void> {
    const entries = await readdir(TEMPLATE_DIRECTORY, { withFileTypes: true })

    for (const entry of entries) {
      const sourcePath = join(TEMPLATE_DIRECTORY, entry.name)
      const destinationPath = join(process.cwd(), entry.name)

      await cp(sourcePath, destinationPath, {
        recursive: true,
        force: false,
        errorOnExist: true,
      })
    }
  }

  async readFile({ path }: { path: string }): Promise<string> {
    const fullPath = resolve(process.cwd(), path)
    return fsReadFile(fullPath, 'utf8')
  }

  async getHTMLFromComponent({ component }: { component: string }): Promise<string> {
    if (!existsSync(CWD_PACKAGE_JSON_PATH)) {
      throw new Error('package.json not found in current directory. Run devsync build from the project root.')
    }

    if (!existsSync(resolve(process.cwd(), 'node_modules'))) {
      await runBunCommand(['install'])
    }

    await runBunCommand(['run', 'build'])

    return fsReadFile(resolve(process.cwd(), 'dist', component, 'index.html'), 'utf8')
  }

  async createPDF({ html: _html, path: _path }: { html: string; path: string }): Promise<void> {}

  async writeFile({ path, data }: { path: string; data: string }): Promise<void> {
    const fullPath = resolve(process.cwd(), path)
    await mkdir(dirname(fullPath), { recursive: true })
    await fsWriteFile(fullPath, data, 'utf8')
  }
}

export default BuildRepositoryImpl
