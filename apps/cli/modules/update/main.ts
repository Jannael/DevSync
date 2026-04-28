import UpdateCommand from './app/update-command'
import createGithubProfileUseCase from '@/shared/app/create-github-profile.use-case'
import createAcademicsUseCase from '@/shared/app/create-academics.use-case'
import createLinkedinUseCase from '@/shared/app/create-linkedin.use-case'

export default async function update() {
  const updateCommand = new UpdateCommand(
    new createGithubProfileUseCase(),
    new createAcademicsUseCase(),
    new createLinkedinUseCase(),
  )

  await updateCommand.execute()
}
