import type { IMemberCollection } from './Member'

export interface IInvitation extends Omit<IMemberCollection, 'isInvitation'> {}

const Invitation: IInvitation = {
	groupId: '123',
	account: '123',
	role: '123',
}

console.log(Invitation)
