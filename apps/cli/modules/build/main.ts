import BuildCommand from '@/modules/build/app/build-command'

export default async function build() {
  const buildCommand = new BuildCommand()
  await buildCommand.execute()
}
