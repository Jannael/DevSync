import { Router } from 'express'
import Adapter from '../adapter/Task.adapter'
import auth from '../middleware/Role.middleware'
import Roles from '../constant/Role.constant'

const router = Router()

router.post('/get/', auth([Roles.techLead, Roles.developer, Roles.documenter]), Adapter.get)
router.post(
	'/list/',
	auth([Roles.techLead, Roles.developer, Roles.documenter]),
	Adapter.list,
)

router.put('/update/', auth([Roles.techLead]), Adapter.update)
router.post('/create/', auth([Roles.techLead]), Adapter.create)
router.delete('/delete/', auth([Roles.techLead]), Adapter.delete)

export default router
