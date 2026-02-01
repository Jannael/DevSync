import { Router } from 'express'
import controller from '../controller/solution/solution.controller'
import auth from '../middleware/auth'

const router = Router()

router.post(
	'/get/',
	auth(['techLead', 'developer', 'documenter']),
	controller.get,
)

router.put('/update/', auth(['techLead', 'developer']), controller.update)
router.post('/create/', auth(['techLead', 'developer']), controller.create)
router.delete('/delete/', auth(['techLead', 'developer']), controller.delete)

export default router
