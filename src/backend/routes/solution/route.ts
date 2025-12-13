import { Router } from 'express'
import auth from './../../middleware/auth'

const router = Router()

router.post('/get/', auth(['techLead', 'developer', 'documenter']))

router.put('/update/', auth(['techLead', 'developer']))
router.post('/create/', auth(['techLead', 'developer']))
router.delete('/delete/', auth(['techLead', 'developer']))

export default router
