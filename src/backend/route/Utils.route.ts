import { type Request, type Response, Router } from 'express'
import auth from '../middleware/Auth.middleware'

const router = Router()

router.get('/healthChecker/', (_req: Request, res: Response) => {
	res.json({ ok: 1 })
})

router.post(
	'/protected/',
	auth(['techLead']),
	(_req: Request, res: Response) => {
		res.json({ ok: 1 })
	},
)

export default router
