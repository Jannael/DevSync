import { Router } from 'express'
import Adapter from '../adapter/Solution.adapter'
import Roles from '../constant/Role.constant'
import RoleMiddleware from '../middleware/Role.middleware'

const router = Router()

router.post(
	'/get/',
	RoleMiddleware([Roles.techLead, Roles.developer, Roles.documenter]),
	Adapter.get,
)
router.put(
	'/update/',
	RoleMiddleware([Roles.techLead, Roles.developer, Roles.documenter]),
	Adapter.update,
)
router.post(
	'/create/',
	RoleMiddleware([Roles.techLead, Roles.developer, Roles.documenter]),
	Adapter.create,
)
router.delete(
	'/delete/',
	RoleMiddleware([Roles.techLead, Roles.developer, Roles.documenter]),
	Adapter.delete,
)

export default router
