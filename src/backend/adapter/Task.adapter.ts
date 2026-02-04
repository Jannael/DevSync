import TaskController from '../controller/Task.controller'
import CreateAdapter from '../utils/helper/CreateAdapter.helper'

const TaskAdapter = {
	Get: CreateAdapter({ controller: TaskController.Get }),
	List: CreateAdapter({ controller: TaskController.List }),
	Create: CreateAdapter({ controller: TaskController.Create }),
	Update: CreateAdapter({ controller: TaskController.Update }),
	Delete: CreateAdapter({ controller: TaskController.Delete }),
}

export default TaskAdapter
