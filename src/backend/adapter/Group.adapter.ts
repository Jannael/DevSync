import GroupController from '../controller/Group.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const GroupAdapter = {
	Get: CreateAdapter({ controller: GroupController.Get }),
	Create: CreateAdapter({
		controller: GroupController.Create,
		options: { transaction: true },
	}),
	Update: CreateAdapter({ controller: GroupController.Update }),
	Delete: CreateAdapter({
		controller: GroupController.Delete,
		options: { transaction: true },
	}),
	Join: CreateAdapter({ controller: GroupController.Join }),
	Quit: CreateAdapter({ controller: GroupController.Quit }),
}

export default GroupAdapter
