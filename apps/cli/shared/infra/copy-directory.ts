import { cp, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { ServerError } from '@/error/error-instance'
import { SPACE } from '@/utils/icons-terminal'

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
    throw new ServerError(
      'Failed to copy directory',
      `${SPACE}${SPACE}Check if source directory exists.\n` +
        `${SPACE}${SPACE}Verify destination is writable.`
    )
  }
}
