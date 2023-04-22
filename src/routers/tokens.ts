import express from 'express'

import validators from '../middlewares/validators/tokens.js'
import controllers from '../controllers/tokens.js'

const router = express.Router()

router.post('/', [validators.create], controllers.create)

export default router
