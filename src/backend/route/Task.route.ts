import { Router } from 'express'
import TaskAdapter from '../adapter/Task.adapter'
import Roles, { ValidRoles } from '../constant/Role.constant'
import RoleMiddleware from '../middleware/Role.middleware'

const router = Router()

router.post(
	'/get/',
	RoleMiddleware(ValidRoles, TaskAdapter.Get.ErrorLink),
	TaskAdapter.Get,
)
router.post(
	'/list/',
	RoleMiddleware(ValidRoles, TaskAdapter.List.ErrorLink),
	TaskAdapter.List,
)

router.put(
	'/update/',
	RoleMiddleware([Roles.techLead], TaskAdapter.Update.ErrorLink),
	TaskAdapter.Update,
)
router.post(
	'/create/',
	RoleMiddleware([Roles.techLead], TaskAdapter.Create.ErrorLink),
	TaskAdapter.Create,
)
router.delete(
	'/delete/',
	RoleMiddleware([Roles.techLead], TaskAdapter.Delete.ErrorLink),
	TaskAdapter.Delete,
)

export default router
