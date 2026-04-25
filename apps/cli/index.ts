#!/usr/bin/env bun
import build from '@/build/main'
import init from '@/init/main'
import update from '@/update/main'
import { X } from '@/utils/icons-terminal'

const args = Bun.argv.slice(2)

if (args[0] === 'build') build()
else if (args[0] === 'init') init()
else if (args[0] === 'update') update()
else {
  console.log(X('Command not found'))
}