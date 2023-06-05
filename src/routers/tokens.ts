import express from 'express'

import { CreateTokenDto } from '../dto/create-token.dto'
import { validator } from '../middlewares/validator'
import controllers from '../controllers/tokens'

const router = express.Router()

router.post('/', [validator({ Dto: CreateTokenDto })], controllers.create)

export default router
