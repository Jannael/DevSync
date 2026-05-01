import { cp, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { ServerError } from '@/error/error-instance'

export async function copyDirectory(directoryPath: string, output: string): Promise<void> {
  try {
    const entries = await readdir(directoryPath, { withFileTypes: true })

    for (const entry of entries) {
      const sourcePath = join(directoryPath, entry.name)
      const destinationPath = join(output, entry.name)

      await cp(sourcePath, destinationPath, {
        recursive: true,
        force: false,
        errorOnExist: false,
      })
    }
  } catch {
    throw new ServerError('Failed to copy directory')
  }
}
