import { Router } from 'express'
import auth from './../../middleware/auth'

const router = Router()

router.post('/get/', auth(['techLead', 'developer', 'documenter']))
router.post('/list/', auth(['techLead', 'developer', 'documenter']))

router.post('/create/', auth(['techLead']))
router.put('/update/', auth(['techLead']))
router.delete('/delete/', auth(['techLead']))

export default router
