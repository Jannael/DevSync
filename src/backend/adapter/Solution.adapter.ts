import SolutionController from '../controller/Solution.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const SolutionAdapter = {
	Get: CreateAdapter({
		controller: SolutionController.Get,
		SuccessLink: [
			{ rel: 'self', href: '/solution/v1/get/' },
			{ rel: 'update', href: '/solution/v1/update/' },
			{ rel: 'delete', href: '/solution/v1/delete/' },
			{ rel: 'task', href: '/task/v1/get/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/solution/v1/get/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{
				rel: 'login',
				href: '/auth/v1/request/refreshToken/code/',
			},
		],
	}),
	Create: CreateAdapter({
		controller: SolutionController.Create,
		options: { transaction: true },
		SuccessLink: [
			{ rel: 'self', href: '/solution/v1/create/' },
			{ rel: 'update', href: '/solution/v1/update/' },
			{ rel: 'delete', href: '/solution/v1/delete/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/solution/v1/create/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{
				rel: 'login',
				href: '/auth/v1/request/refreshToken/code/',
			},
		],
	}),
	Update: CreateAdapter({
		controller: SolutionController.Update,
		SuccessLink: [
			{ rel: 'self', href: '/solution/v1/update/' },
			{ rel: 'get', href: '/solution/v1/get/' },
			{ rel: 'delete', href: '/solution/v1/delete/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/solution/v1/update/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{
				rel: 'login',
				href: '/auth/v1/request/refreshToken/code/',
			},
		],
	}),
	Delete: CreateAdapter({
		controller: SolutionController.Delete,
		options: { transaction: true },
		SuccessLink: [
			{ rel: 'self', href: '/solution/v1/delete/' },
			{ rel: 'task', href: '/task/v1/get/' },
		],
		ErrorLink: [
			{ rel: 'self', href: '/solution/v1/delete/' },
			{ rel: 'accessToken', href: '/auth/v1/request/accessToken/' },
			{
				rel: 'login',
				href: '/auth/v1/request/refreshToken/code/',
			},
		],
	}),
}

export default SolutionAdapter
