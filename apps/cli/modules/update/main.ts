import UpdateCommand from './app/update-command'

export default async function update() {
  const updateCommand = new UpdateCommand()
  await updateCommand.execute()
}
