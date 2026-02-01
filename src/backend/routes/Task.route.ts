import { Router } from 'express'
import controller from '../controller/task/task.controller'
import auth from '../middleware/auth'

const router = Router()

router.post(
	'/get/',
	auth(['techLead', 'developer', 'documenter']),
	controller.get,
)
router.post(
	'/list/',
	auth(['techLead', 'developer', 'documenter']),
	controller.list,
)

router.put('/update/', auth(['techLead']), controller.update)
router.post('/create/', auth(['techLead']), controller.create)
router.delete('/delete/', auth(['techLead']), controller.delete)

export default router
