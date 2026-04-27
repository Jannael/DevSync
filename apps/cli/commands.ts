export const AVAILABLE_COMMANDS = [
  {
    name: 'init',
    command: 'devsync init',
    description: 'Initialize DEVSYNC.json file',
  },
  {
    name: 'build',
    command: 'devsync build',
    description: 'Build portfolio, linkedin.md, README.md and CV from DEVSYNC.json',
  },
  {
    name: 'update',
    command: 'devsync update',
    description: 'Update linkedin.md, Github Profile, academics and create PDF from cv component',
  },
] as const

export type CommandNames = (typeof AVAILABLE_COMMANDS)[number]['name']
