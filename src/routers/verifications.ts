import express from 'express'

import validators from '../middlewares/validators/verifications'
import controllers from '../controllers/verifications'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/', [validators.create], controllers.create)

export default router
