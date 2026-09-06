import process from 'node:process'
import express from 'express'
import mongoose from 'mongoose'

import { HealthcheckController } from '../../adapters/controllers/healthcheck.controller'
import { PasswordsController } from '../../adapters/controllers/passwords.controller'
import { RootController } from '../../adapters/controllers/root.controller'
import { TokensController } from '../../adapters/controllers/tokens.controller'
import { UsersController } from '../../adapters/controllers/users.controller'
import { VerificationsController } from '../../adapters/controllers/verifications.controller'
import { CreateTokenDto } from '../../adapters/dtos/create-token.dto'
import { CreateUserDto } from '../../adapters/dtos/create-user.dto'
import { CreateVerificationDto } from '../../adapters/dtos/create-verification.dto'
import { ForgotPasswordDto } from '../../adapters/dtos/forgot-password.dto'
import { ResetPasswordDto } from '../../adapters/dtos/reset-password.dto'
import { UpdateUserPasswordDto } from '../../adapters/dtos/update-user-password.dto'
import { UpdateUserDto } from '../../adapters/dtos/update-user.dto'
import auth from '../../adapters/middlewares/auth'
import { validator } from '../../adapters/middlewares/validator'
import { CreateTokenUseCase } from '../../application/use-cases/auth/create-token.use-case'
import { ForgotPasswordUseCase } from '../../application/use-cases/auth/forgot-password.use-case'
import { ResetPasswordUseCase } from '../../application/use-cases/auth/reset-password.use-case'
import { HealthcheckUseCase } from '../../application/use-cases/healthcheck/healthcheck.use-case'
import { CreateUserUseCase } from '../../application/use-cases/users/create-user.use-case'
import { DeleteUserUseCase } from '../../application/use-cases/users/delete-user.use-case'
import { GetUserByIdUseCase } from '../../application/use-cases/users/get-user-by-id.use-case'
import { ListUsersUseCase } from '../../application/use-cases/users/list-users.use-case'
import { UpdateUserPasswordUseCase } from '../../application/use-cases/users/update-user-password.use-case'
import { UpdateUserUseCase } from '../../application/use-cases/users/update-user.use-case'
import { VerifyEmailUseCase } from '../../application/use-cases/verifications/verify-email.use-case'
import { configuration } from '../../config'
import { UserModel } from '../database/mongoose/models/user.model'
import { MongooseUserRepository } from '../database/mongoose/repositories/mongoose-user.repository'
import { HttpNotificationSender } from '../notifications/http-notification-sender'
import { Argon2PasswordHasher } from '../security/argon2-password-hasher'
import { JwtTokenProvider } from '../security/jwt-token-provider'

const router = express.Router()

// Infrastructure Adapters
const userRepository = new MongooseUserRepository(UserModel)
const passwordHasher = new Argon2PasswordHasher()
const tokenProvider = new JwtTokenProvider()
const notificationSender = new HttpNotificationSender({
  baseUrl: configuration.notifications.url,
  suppressErrors: configuration.environment !== 'production',
})

// Application Use Cases
const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher, notificationSender)
const listUsersUseCase = new ListUsersUseCase(userRepository)
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository)
const updateUserUseCase = new UpdateUserUseCase(userRepository)
const updateUserPasswordUseCase = new UpdateUserPasswordUseCase(userRepository, passwordHasher)
const deleteUserUseCase = new DeleteUserUseCase(userRepository)
const createTokenUseCase = new CreateTokenUseCase(userRepository, passwordHasher, tokenProvider)
const verifyEmailUseCase = new VerifyEmailUseCase(userRepository)
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, notificationSender)
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, passwordHasher)

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
const passwordsController = new PasswordsController({
  forgotPasswordUseCase,
  resetPasswordUseCase,
})

const checkDatabase = () => (mongoose.connection.readyState === 1 ? 'up' as const : 'down' as const)
async function checkNotifications(): Promise<'up' | 'down'> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 1500)
    const res = await fetch(`${configuration.notifications.url.replace(/\/$/, '')}/api/healthcheck`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return res.ok ? 'up' : 'down'
  }
  catch {
    return 'down'
  }
}

const healthcheckUseCase = new HealthcheckUseCase({
  checkDatabase,
  checkNotifications,
  getUptime: () => process.uptime(),
})
export const healthcheckController = new HealthcheckController(healthcheckUseCase)

router.get('/', rootController.get)
router.get('/healthcheck', healthcheckController.get)

router.post('/tokens', [validator({ Dto: CreateTokenDto })], tokensController.create)

router.post('/auth/forgot-password', [validator({ Dto: ForgotPasswordDto })], passwordsController.forgotPassword)
router.post('/auth/reset-password', [validator({ Dto: ResetPasswordDto })], passwordsController.resetPassword)

router.post('/users', [validator({ Dto: CreateUserDto })], usersController.create)
router.get('/users', [auth()], usersController.list)
router.get('/users/:id', [auth()], usersController.show)
router.patch('/users/:id', [auth({ onlyTheOwner: true }), validator({ Dto: UpdateUserDto })], usersController.update)
router.put('/users/:id/password', [auth({ onlyTheOwner: true }), validator({ Dto: UpdateUserPasswordDto })], usersController.updatePassword)
router.delete('/users/:id', [auth({ onlyTheOwner: true })], usersController.delete)

router.post('/verifications', [validator({ Dto: CreateVerificationDto })], verificationsController.create)

export default router
