import { Router } from 'express'
import MemberAdapter from '../adapter/Member.adapter'
import Roles, { ValidRoles } from '../constant/Role.constant'
import RoleMiddleware from '../middleware/Role.middleware'

const router = Router()

router.post('/get/', RoleMiddleware(ValidRoles), MemberAdapter.Get) // members of a group
router.delete(
	'/remove/',
	RoleMiddleware([Roles.techLead]),
	MemberAdapter.Remove,
) // remove a member from a group
router.patch(
	'/update/role/',
	RoleMiddleware([Roles.techLead]),
	MemberAdapter.UpdateRole,
) // update the role of a member

export default router
