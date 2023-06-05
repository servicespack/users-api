import express from 'express'

import { CreateTokenDto } from '../dto/create-token.dto'
import { validator } from '../middlewares/validator'
import controllers from '../controllers/tokens'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/', [validator({ Dto: CreateTokenDto })], controllers.create)

export default router
