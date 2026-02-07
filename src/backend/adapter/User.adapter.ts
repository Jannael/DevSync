import UserController from '../controller/User.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const UserAdapter = {
	Get: CreateAdapter({
		controller: UserController.Get,
		SuccessLink: [
			{ rel: 'self', href: '/user/v1/get/' },
			{ rel: 'groups', href: '/user/v1/get/group/' },
			{ rel: 'invitations', href: '/invitation/v1/get/user/' },
			{ rel: 'update', href: '/user/v1/update/' },
			{ rel: 'delete', href: '/user/v1/delete/' },
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
	}),
	Update: CreateAdapter({
		controller: UserController.Update,
		SuccessLink: [
			{ rel: 'self', href: '/user/v1/update/' },
			{ rel: 'details', href: '/user/v1/get/' },
			{ rel: 'delete', href: '/user/v1/delete/' },
		],
	}),
	Create: CreateAdapter({
		controller: UserController.Create,
		SuccessLink: [
			{ rel: 'self', href: '/user/v1/create/' },
			{ rel: 'details', href: '/user/v1/get/' },
		],
	}),
	Delete: CreateAdapter({
		controller: UserController.Delete,
		options: { transaction: true },
		SuccessLink: [
			{ rel: 'self', href: '/user/v1/delete/' },
			{ rel: 'create', href: '/user/v1/create/' },
		],
	}),
}

export default UserAdapter
