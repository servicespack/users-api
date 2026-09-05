import express from 'express'

import { RootController } from '../../adapters/controllers/root.controller'
import { TokensController } from '../../adapters/controllers/tokens.controller'
import { UsersController } from '../../adapters/controllers/users.controller'
import { VerificationsController } from '../../adapters/controllers/verifications.controller'
import { CreateTokenDto } from '../../adapters/dtos/create-token.dto'
import { CreateUserDto } from '../../adapters/dtos/create-user.dto'
import { CreateVerificationDto } from '../../adapters/dtos/create-verification.dto'
import { UpdateUserPasswordDto } from '../../adapters/dtos/update-user-password.dto'
import { UpdateUserDto } from '../../adapters/dtos/update-user.dto'
import auth from '../../adapters/middlewares/auth'
import { validator } from '../../adapters/middlewares/validator'
import { CreateTokenUseCase } from '../../application/use-cases/auth/create-token.use-case'
import { CreateUserUseCase } from '../../application/use-cases/users/create-user.use-case'
import { DeleteUserUseCase } from '../../application/use-cases/users/delete-user.use-case'
import { GetUserByIdUseCase } from '../../application/use-cases/users/get-user-by-id.use-case'
import { ListUsersUseCase } from '../../application/use-cases/users/list-users.use-case'
import { UpdateUserPasswordUseCase } from '../../application/use-cases/users/update-user-password.use-case'
import { UpdateUserUseCase } from '../../application/use-cases/users/update-user.use-case'
import { VerifyEmailUseCase } from '../../application/use-cases/verifications/verify-email.use-case'
import { UserModel } from '../database/mongoose/models/user.model'
import { MongooseUserRepository } from '../database/mongoose/repositories/mongoose-user.repository'
import { Argon2PasswordHasher } from '../security/argon2-password-hasher'
import { JwtTokenProvider } from '../security/jwt-token-provider'

const router = express.Router()

// Infrastructure Adapters
const userRepository = new MongooseUserRepository(UserModel)
const passwordHasher = new Argon2PasswordHasher()
const tokenProvider = new JwtTokenProvider()

// Application Use Cases
const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher)
const listUsersUseCase = new ListUsersUseCase(userRepository)
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
const updateUserUseCase = new UpdateUserUseCase(userRepository)
const updateUserPasswordUseCase = new UpdateUserPasswordUseCase(userRepository, passwordHasher)
const deleteUserUseCase = new DeleteUserUseCase(userRepository)
const createTokenUseCase = new CreateTokenUseCase(userRepository, passwordHasher, tokenProvider)
const verifyEmailUseCase = new VerifyEmailUseCase(userRepository)

// Controllers
const rootController = new RootController()
const tokensController = new TokensController(createTokenUseCase)
const usersController = new UsersController({
  createUserUseCase,
  listUsersUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
  updateUserPasswordUseCase,
  deleteUserUseCase,
})
const verificationsController = new VerificationsController(verifyEmailUseCase)

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
