import type { IMemberCollection } from './Member'

export interface IInvitation extends Omit<IMemberCollection, 'isInvitation'> {}

export interface IInvitationsUser extends Omit<IInvitation, 'account'> {
	name: string
}
