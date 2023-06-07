import express from 'express'

import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { UpdateUserPasswordDto } from '../dto/update-user-password.dto'
import { validator } from '../middlewares/validator'
import auth from '../middlewares/auth'
import controllers from '../controllers/users'

const router = express.Router()

router.post('/', [validator({ Dto: CreateUserDto })], controllers.create)
router.get('/', [auth()], controllers.list)
router.get('/:id', [auth()], controllers.show)
router.patch('/:id', [auth({ onlyTheOwner: true }), validator({ Dto: UpdateUserDto })], controllers.update)
router.put('/:id/password', [auth({ onlyTheOwner: true }), validator({ Dto: UpdateUserPasswordDto })], controllers.updatePassword)
router.delete('/:id', [auth({ onlyTheOwner: true })], controllers.delete)

export default router
