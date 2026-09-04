import express from 'express'

import { RootController } from './controllers/root.controller'
import { TokensController } from './controllers/tokens.controller'
import { UsersController } from './controllers/users.controller'
import { VerificationsController } from './controllers/verifications.controller'
import { CreateTokenDto } from './dto/create-token.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { CreateVerificationDto } from './dto/create-verification.dto'
import { UpdateUserPasswordDto } from './dto/update-user-password.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user'
import auth from './middlewares/auth'
import { validator } from './middlewares/validator'

const router = express.Router()

const rootController = new RootController()
const tokensController = new TokensController(User)
const usersController = new UsersController(User)
const verificationsController = new VerificationsController(User)

router.get('/', rootController.get)

router.post('/tokens', [validator({ Dto: CreateTokenDto })], tokensController.create)

router.post('/users', [validator({ Dto: CreateUserDto })], usersController.create)
router.get('/users', [auth()], usersController.list)
router.get('/users/:id', [auth()], usersController.show)
router.patch('/users/:id', [auth({ onlyTheOwner: true }), validator({ Dto: UpdateUserDto })], usersController.update)
router.put('/users/:id/password', [auth({ onlyTheOwner: true }), validator({ Dto: UpdateUserPasswordDto })], usersController.updatePassword)
router.delete('/users/:id', [auth({ onlyTheOwner: true })], usersController.delete)

router.post('/verifications', [validator({ Dto: CreateVerificationDto })], verificationsController.create)

export default router
