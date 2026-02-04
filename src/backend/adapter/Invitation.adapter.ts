import InvitationController from '../controller/Invitation.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const InvitationAdapter = {
	GetForUser: CreateAdapter({ controller: InvitationController.GetForUser }),
	GetForGroup: CreateAdapter({ controller: InvitationController.GetForGroup }),
	Create: CreateAdapter({ controller: InvitationController.Create }),
	UpdateRole: CreateAdapter({ controller: InvitationController.UpdateRole }),
	Accept: CreateAdapter({ controller: InvitationController.Accept }),
	Reject: CreateAdapter({ controller: InvitationController.Reject }),
	Cancel: CreateAdapter({ controller: InvitationController.Cancel }),
}

export default InvitationAdapter
