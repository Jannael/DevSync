import type { IMemberCollection } from './Member'

export interface IInvitation extends Omit<IMemberCollection, 'isInvitation'> {}

export interface IInvitationReturn extends Omit<IInvitation, 'account'> {}
