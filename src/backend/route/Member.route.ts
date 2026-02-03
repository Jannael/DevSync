import { Router } from 'express'
import Roles, { ValidRoles } from '../constant/Role.constant'
import RoleMiddleware from '../middleware/Role.middleware'

const router = Router()

router.post(
	'/get/',
	RoleMiddleware(ValidRoles),
) // members of a group
router.delete('/remove/', RoleMiddleware([Roles.techLead])) // remove a member from a group
router.delete('/update/role/', RoleMiddleware([Roles.techLead])) // update the role of a member

export default router
