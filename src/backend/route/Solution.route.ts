import { Router } from 'express'
import SolutionAdapter from '../adapter/Solution.adapter'
import { ValidRoles } from '../constant/Role.constant'
import RoleMiddleware from '../middleware/Role.middleware'

const router = Router()

router.post(
	'/get/',
	RoleMiddleware(ValidRoles, SolutionAdapter.Get.ErrorLink),
	SolutionAdapter.Get,
)
router.put(
	'/update/',
	RoleMiddleware(ValidRoles, SolutionAdapter.Update.ErrorLink),
	SolutionAdapter.Update,
)
router.post(
	'/create/',
	RoleMiddleware(ValidRoles, SolutionAdapter.Create.ErrorLink),
	SolutionAdapter.Create,
)
router.delete(
	'/delete/',
	RoleMiddleware(ValidRoles, SolutionAdapter.Delete.ErrorLink),
	SolutionAdapter.Delete,
)

export default router
