import express from 'express';

import { UsersController } from '../controllers/users.controller';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserPasswordDto } from '../dto/update-user-password.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import auth from '../middlewares/auth';
import { validator } from '../middlewares/validator';
import { UserRepository } from '../repositories/user.repository';
import { knex } from '../start/database';

const router = express.Router();
const userRepository = new UserRepository(knex);
const usersController = new UsersController(userRepository);

router.post('/', [validator({ Dto: CreateUserDto })], usersController.create);
router.get('/', [auth()], usersController.list);
router.get('/:id', [auth()], usersController.show);
router.patch('/:id', [auth({ onlyTheOwner: true }), validator({ Dto: UpdateUserDto })], usersController.update);
router.put('/:id/password', [auth({ onlyTheOwner: true }), validator({ Dto: UpdateUserPasswordDto })], usersController.updatePassword);
router.delete('/:id', [auth({ onlyTheOwner: true })], usersController.delete);

export default router;
