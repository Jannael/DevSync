import { Router } from 'express'
import Roles from '../constant/Role.constant'
import RoleMiddleware from '../middleware/Role.middleware'

const router = Router()

router.post(
	'/get/',
	RoleMiddleware([Roles.techLead, Roles.developer, Roles.documenter]),
) // members of a group
router.delete('/remove/', RoleMiddleware([Roles.techLead])) // remove a member from a group
router.delete('/update/role/', RoleMiddleware([Roles.techLead])) // update the role of a member

export default router
