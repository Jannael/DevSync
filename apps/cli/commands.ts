export const AVAILABLE_COMMANDS = [
  {
    name: 'init',
    command: 'devsync init',
    description: 'Copy portfolio template to current folder',
  },
  {
    name: 'build',
    command: 'devsync build',
    description: 'Build linkedin.md, Github Profile, academics and create PDF from cv component',
  },
  {
    name: 'create-template',
    command: 'devsync create-template',
    description: 'Create a new template for devsync',
  },
] as const

export type CommandNames = (typeof AVAILABLE_COMMANDS)[number]['name']
