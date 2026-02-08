import InvitationController from '../controller/Invitation.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const InvitationAdapter = {
	GetForUser: CreateAdapter({
		controller: InvitationController.GetForUser,
		SuccessLink: [
			{ rel: 'self', href: '/invitation/v1/get/user/' },
			{ rel: 'details', href: '/user/v1/get/' },
			{ rel: 'accept', href: '/invitation/v1/accept/' },
			{ rel: 'reject', href: '/invitation/v1/reject/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/invitation/v1/get/user/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
	GetForGroup: CreateAdapter({
		controller: InvitationController.GetForGroup,
		SuccessLink: [
			{ rel: 'self', href: '/invitation/v1/get/group/' },
			{ rel: 'details', href: '/group/v1/get/' },
			{ rel: 'cancel', href: '/invitation/v1/cancel/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/invitation/v1/get/group/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
	Create: CreateAdapter({
		controller: InvitationController.Create,
		SuccessLink: [
			{ rel: 'self', href: '/invitation/v1/create/' },
			{ rel: 'invitations', href: '/invitation/v1/get/group/' },
			{ rel: 'group', href: '/group/v1/get/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/invitation/v1/create/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
	UpdateRole: CreateAdapter({
		controller: InvitationController.UpdateRole,
		SuccessLink: [
			{ rel: 'self', href: '/invitation/v1/update/role/' },
			{ rel: 'group', href: '/group/v1/get/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/invitation/v1/update/role/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
	Accept: CreateAdapter({
		controller: InvitationController.Accept,
		SuccessLink: [
			{ rel: 'self', href: '/invitation/v1/accept/' },
			{ rel: 'details', href: '/group/v1/get/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/invitation/v1/accept/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
	Reject: CreateAdapter({
		controller: InvitationController.Reject,
		SuccessLink: [
			{ rel: 'self', href: '/invitation/v1/reject/' },
			{ rel: 'details', href: '/user/v1/get/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/invitation/v1/reject/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
	Cancel: CreateAdapter({
		controller: InvitationController.Cancel,
		SuccessLink: [
			{ rel: 'self', href: '/invitation/v1/cancel/' },
			{ rel: 'details', href: '/group/v1/get/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/invitation/v1/cancel/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
}

export default InvitationAdapter
