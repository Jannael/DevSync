import { Router } from 'express'
import InvitationAdapter from '../adapter/Invitation.adapter'
import Roles from '../constant/Role.constant'
import RoleMiddleware from '../middleware/Role.middleware'

const router = Router()

router.patch(
	'/update/role/',
	RoleMiddleware([Roles.techLead]),
	InvitationAdapter.UpdateRole,
)
router.post(
	'/create/',
	RoleMiddleware([Roles.techLead]),
	InvitationAdapter.Create,
)
router.post(
	'/cancel/',
	RoleMiddleware([Roles.techLead]),
	InvitationAdapter.Cancel,
)

router.post('/accept/', InvitationAdapter.Accept)
router.post('/reject/', InvitationAdapter.Reject)

export default router
