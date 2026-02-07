import TaskController from '../controller/Task.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const TaskAdapter = {
	Get: CreateAdapter({
		controller: TaskController.Get,
		SuccessLink: [
			{ rel: 'self', href: '/task/v1/get/' },
			{ rel: 'list', href: '/task/v1/list/' },
			{ rel: 'update', href: '/task/v1/update/' },
			{ rel: 'delete', href: '/task/v1/delete/' },
			{ rel: 'solution', href: '/solution/v1/get/' },
		],
	}),
	List: CreateAdapter({
		controller: TaskController.List,
		options: { transaction: true },
		SuccessLink: [
			{ rel: 'self', href: '/task/v1/list/' },
			{ rel: 'get', href: '/task/v1/get/' },
			{ rel: 'create', href: '/task/v1/create/' },
		],
	}),
	Create: CreateAdapter({
		controller: TaskController.Create,
		SuccessLink: [
			{ rel: 'self', href: '/task/v1/create/' },
			{ rel: 'get', href: '/task/v1/get/' },
			{ rel: 'list', href: '/task/v1/list/' },
		],
	}),
	Update: CreateAdapter({
		controller: TaskController.Update,
		SuccessLink: [
			{ rel: 'self', href: '/task/v1/update/' },
			{ rel: 'get', href: '/task/v1/get/' },
			{ rel: 'list', href: '/task/v1/list/' },
			{ rel: 'delete', href: '/task/v1/delete/' },
		],
	}),
	Delete: CreateAdapter({
		controller: TaskController.Delete,
		options: { transaction: true },
		SuccessLink: [
			{ rel: 'self', href: '/task/v1/delete/' },
			{ rel: 'list', href: '/task/v1/list/' },
			{ rel: 'create', href: '/task/v1/create/' },
		],
	}),
}

export default TaskAdapter
