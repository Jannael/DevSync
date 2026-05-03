import type { CommandNames } from '@/commands'
import init from '@/modules/init/main'
import build from '@/modules/build/main'
import createTemplate from '@/modules/create-template/main'

type CommandHandler = (args: string[]) => Promise<void>

export const COMMANDS_FN: Record<CommandNames, CommandHandler> = {
  init,
  build,
  'create-template': createTemplate,
} as const
