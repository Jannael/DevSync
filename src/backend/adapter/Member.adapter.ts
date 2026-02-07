import MemberController from '../controller/Member.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const MemberAdapter = {
	Get: CreateAdapter({
		controller: MemberController.Get,
		SuccessLink: [
			{ rel: 'self', href: '/member/v1/get/' },
			{ rel: 'group', href: '/group/v1/get/' },
		],
	}),
	UpdateRole: CreateAdapter({
		controller: MemberController.UpdateRole,
		SuccessLink: [
			{ rel: 'self', href: '/member/v1/update/role/' },
			{ rel: 'get', href: '/member/v1/get/' },
		],
	}),
	Remove: CreateAdapter({
		controller: MemberController.Remove,
		SuccessLink: [
			{ rel: 'self', href: '/member/v1/remove/' },
			{ rel: 'group', href: '/group/v1/get/' },
		],
	}),
}

export default MemberAdapter
