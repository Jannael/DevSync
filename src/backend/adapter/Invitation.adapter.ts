import InvitationController from '../controller/Invitation.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const InvitationAdapter = {
	GetForUser: CreateAdapter({
		controller: InvitationController.GetForUser,
		SuccessLink: [
			{ rel: 'self', href: '/invitation/v1/get/user/' },
			{ rel: 'details', href: '/user/v1/get/' },
		],
	}),
	GetForGroup: CreateAdapter({
		controller: InvitationController.GetForGroup,
		SuccessLink: [
			{ rel: 'self', href: '/invitation/v1/get/group/' },
			{ rel: 'details', href: '/group/v1/get/' },
		],
	}),
	Create: CreateAdapter({
		controller: InvitationController.Create,
		SuccessLink: [
			{ rel: 'self', href: '/invitation/v1/create/' },
			{ rel: 'invitations', href: '/invitation/v1/get/group/' },
			{ rel: 'group', href: '/group/v1/get/' },
		],
	}),
	UpdateRole: CreateAdapter({
		controller: InvitationController.UpdateRole,
		SuccessLink: [
			{ rel: 'self', href: '/invitation/v1/update/role/' },
			{ rel: 'group', href: '/group/v1/get/' },
		],
	}),
	Accept: CreateAdapter({
		controller: InvitationController.Accept,
		SuccessLink: [
			{ rel: 'self', href: '/invitation/v1/accept/' },
			{ rel: 'details', href: '/group/v1/get/' },
		],
	}),
	Reject: CreateAdapter({
		controller: InvitationController.Reject,
		SuccessLink: [
			{ rel: 'self', href: '/invitation/v1/reject/' },
			{ rel: 'details', href: '/user/v1/get/' },
		],
	}),
	Cancel: CreateAdapter({
		controller: InvitationController.Cancel,
		SuccessLink: [
			{ rel: 'self', href: '/invitation/v1/cancel/' },
			{ rel: 'details', href: '/group/v1/get/' },
		],
	}),
}

export default InvitationAdapter
