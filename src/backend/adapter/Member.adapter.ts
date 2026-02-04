import MemberController from '../controller/Member.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const MemberAdapter = {
	Get: CreateAdapter({ controller: MemberController.Get }),
	UpdateRole: CreateAdapter({ controller: MemberController.UpdateRole }),
	Remove: CreateAdapter({ controller: MemberController.Remove }),
}

export default MemberAdapter
