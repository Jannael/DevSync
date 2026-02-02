import { Router } from 'express'
import Adapter from '../adapter/Group.adapter'
import Roles from '../constant/Role.constant'
import RoleMiddleware from '../middleware/Role.middleware'

const router = Router()

router.post(
	'/get/',
	RoleMiddleware([Roles.techLead, Roles.developer, Roles.documenter]),
	Adapter.get,
)
router.post('/create/', Adapter.create)
router.put('/update/', RoleMiddleware([Roles.techLead]), Adapter.update)
router.delete('/delete/', RoleMiddleware([Roles.techLead]), Adapter.delete)

export default router
