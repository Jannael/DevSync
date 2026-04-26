import type { CommandNames } from '@/commands'
import build from '@/modules/build/main'
import init from '@/modules/init/main'

type CommandHandler = (args: string[]) => Promise<void>

export const COMMANDS_FN: Record<CommandNames, CommandHandler> = {
  init: init,
  build: build,
} as const
