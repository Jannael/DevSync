#!/usr/bin/env bun
import { SPACE } from '@/utils/icons-terminal'
import { AVAILABLE_COMMANDS } from '@/commands'
import { COMMANDS_FN } from '@/commands-fn'
import { GREEN } from '@/utils/colors'

const args = Bun.argv.slice(2)
const command = AVAILABLE_COMMANDS.find((command) => command.name === args[0])

if (command) {
  await COMMANDS_FN[command.name](args)
} else {
  console.log(`${SPACE}Available commands:`)
  AVAILABLE_COMMANDS.forEach((command) => {
    console.log(`${SPACE}${SPACE}${GREEN(command.name.padEnd(10))} ${command.description}`)
  })
}

console.log('')
console.log(
  `${SPACE}Enjoying devsync?, please star the repo: ${GREEN('https://github.com/jannael/devsync')}`,
)
