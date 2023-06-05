/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'

import auth from '../middlewares/auth'
import validators from '../middlewares/validators/users'
import controllers from '../controllers/users'
import { validator } from '../middlewares/validator'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'

const router = express.Router()

router.post('/', [validator({ Dto: CreateUserDto })], controllers.create)
router.get('/', [auth()], controllers.list)
router.get('/:id', [auth()], controllers.show)
router.patch('/:id', [auth({ onlyTheOwner: true }), validator({ Dto: UpdateUserDto })], controllers.update)
router.put('/:id/password', [auth({ onlyTheOwner: true }), validators.updatePassword], controllers.updatePassword)
router.delete('/:id', [auth({ onlyTheOwner: true })], controllers.delete)

export default router
