import { Router } from 'express'
import Adapter from '../adapter/Solution.adapter'
import auth from '../middleware/Auth.middleware'

const router = Router()

router.post('/get/', auth(['techLead', 'developer', 'documenter']), Adapter.get)

router.put('/update/', auth(['techLead', 'developer']), Adapter.update)
router.post('/create/', auth(['techLead', 'developer']), Adapter.create)
router.delete('/delete/', auth(['techLead', 'developer']), Adapter.delete)

export default router
