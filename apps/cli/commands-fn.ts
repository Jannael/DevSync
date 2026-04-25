import type { CommandNames } from '@/commands'
import build from '@/build/main'
import init from '@/init/main'
import update from '@/update/main'

type CommandHandler = (args: string[]) => Promise<void>

export const COMMANDS_FN: Record<CommandNames, CommandHandler> = {
  init: init,
  build: build,
  update: update,
} as const
