import { Router } from 'express'
import Adapter from '../adapter/Task.adapter'
import auth from '../middleware/auth'

const router = Router()

router.post(
	'/get/',
	auth(['techLead', 'developer', 'documenter']),
	Adapter.get,
)
router.post(
	'/list/',
	auth(['techLead', 'developer', 'documenter']),
	Adapter.list,
)

router.put('/update/', auth(['techLead']), Adapter.update)
router.post('/create/', auth(['techLead']), Adapter.create)
router.delete('/delete/', auth(['techLead']), Adapter.delete)

export default router
