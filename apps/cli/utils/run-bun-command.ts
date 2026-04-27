import { ServerError } from '@/error/error-instance'
import { spawn } from 'node:child_process'

export const runBunCommand = async (args: string[]) => {
  try {
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
  } catch {
    throw new ServerError('Failed to run bun command')
  }
}
