import GroupController from '../controller/Group.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const GroupAdapter = {
	Get: CreateAdapter({
		controller: GroupController.Get,
		SuccessLink: [
			{ rel: 'self', href: '/group/v1/get/' },
			{ rel: 'members', href: '/member/v1/get/' },
			{ rel: 'invitations', href: '/invitation/v1/get/group/' },
			{ rel: 'tasks', href: '/task/v1/list/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/group/v1/get/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
	Create: CreateAdapter({
		controller: GroupController.Create,
		options: { transaction: true },
		SuccessLink: [
			{ rel: 'self', href: '/group/v1/create/' },
			{ rel: 'get', href: '/group/v1/get/' },
			{ rel: 'update', href: '/group/v1/update/' },
			{ rel: 'delete', href: '/group/v1/delete/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/group/v1/create/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
	Update: CreateAdapter({
		controller: GroupController.Update,
		SuccessLink: [
			{ rel: 'self', href: '/group/v1/update/' },
			{ rel: 'get', href: '/group/v1/get/' },
			{ rel: 'delete', href: '/group/v1/delete/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/group/v1/update/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
	Delete: CreateAdapter({
		controller: GroupController.Delete,
		options: { transaction: true },
		SuccessLink: [
			{ rel: 'self', href: '/group/v1/delete/' },
			{ rel: 'create', href: '/group/v1/create/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/group/v1/delete/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
	Join: CreateAdapter({
		controller: GroupController.Join,
		SuccessLink: [
			{ rel: 'self', href: '/group/v1/join/' },
			{ rel: 'get', href: '/group/v1/get/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/group/v1/join/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
	Quit: CreateAdapter({
		controller: GroupController.Quit,
		SuccessLink: [
			{ rel: 'self', href: '/group/v1/quit/' },
			{ rel: 'join', href: '/group/v1/join/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/group/v1/quit/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{ rel: 'login', href: '/auth/v1/request/refreshToken/code/' },
		],
	}),
}

export default GroupAdapter
