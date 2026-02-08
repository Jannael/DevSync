import UserController from '../controller/User.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const UserAdapter = {
	Get: CreateAdapter({
		controller: UserController.Get,
		SuccessLink: [
			{ rel: 'self', href: '/user/v1/get/' },
			{ rel: 'groups', href: '/user/v1/get/group/' },
			{ rel: 'invitations', href: '/user/v1/get/invitation/' },
			{ rel: 'update', href: '/user/v1/update/' },
			{ rel: 'delete', href: '/user/v1/delete/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/user/v1/get/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
	GetGroup: CreateAdapter({
		controller: UserController.GetGroup,
		SuccessLink: [
			{ rel: 'self', href: '/user/v1/get/group/' },
			{ rel: 'details', href: '/user/v1/get/' },
			{ rel: 'update', href: '/user/v1/update/' },
			{ rel: 'delete', href: '/user/v1/delete/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/user/v1/get/group/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
	Update: CreateAdapter({
		controller: UserController.Update,
		SuccessLink: [
			{ rel: 'self', href: '/user/v1/update/' },
			{ rel: 'details', href: '/user/v1/get/' },
			{ rel: 'delete', href: '/user/v1/delete/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/user/v1/update/' },
			{ rel: 'verify', href: '/auth/v1/verify/code/' },
			{ rel: 'requestCode', href: '/auth/v1/request/code/' },
		],
	}),
	Create: CreateAdapter({
		controller: UserController.Create,
		options: { transaction: true },
		SuccessLink: [
			{ rel: 'self', href: '/user/v1/create/' },
			{ rel: 'details', href: '/user/v1/get/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/user/v1/create/' },
			{ rel: 'verify', href: '/auth/v1/verify/code/' },
			{ rel: 'requestCode', href: '/auth/v1/request/code/' },
		],
	}),
	Delete: CreateAdapter({
		controller: UserController.Delete,
		options: { transaction: true },
		SuccessLink: [
			{ rel: 'self', href: '/user/v1/delete/' },
			{ rel: 'create', href: '/user/v1/create/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/user/v1/delete/' },
			{ rel: 'verify', href: '/auth/v1/verify/code/' },
			{ rel: 'requestCode', href: '/auth/v1/request/code/' },
		],
	}),
	GetInvitation: CreateAdapter({
		controller: UserController.GetInvitation,
		SuccessLink: [
			{ rel: 'self', href: '/user/v1/get/invitation/' },
			{ rel: 'details', href: '/user/v1/get/' },
			{ rel: 'accept', href: '/invitation/v1/accept/' },
			{ rel: 'reject', href: '/invitation/v1/reject/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/user/v1/get/invitation/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
}

export default UserAdapter
