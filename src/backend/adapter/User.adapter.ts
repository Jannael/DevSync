import UserController from '../controller/User.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const UserAdapter = {
	Get: CreateAdapter({ controller: UserController.Get }),
	GetGroup: CreateAdapter({ controller: UserController.GetGroup }),
	Update: CreateAdapter({ controller: UserController.Update }),
	Create: CreateAdapter({ controller: UserController.Create }),
	Delete: CreateAdapter({ controller: UserController.Delete }),
}

export default UserAdapter
