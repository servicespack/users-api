import express from 'express';

import { UsersController } from '../controllers/users.controller';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserPasswordDto } from '../dto/update-user-password.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user';
import auth from '../middlewares/auth';
import { validator } from '../middlewares/validator';

const router = express.Router();
const usersController = new UsersController(User);

router.post('/', [validator({ Dto: CreateUserDto })], usersController.create);
router.get('/', [auth()], usersController.list);
router.get('/:id', [auth()], usersController.show);
router.patch('/:id', [auth({ onlyTheOwner: true }), validator({ Dto: UpdateUserDto })], usersController.update);
router.put('/:id/password', [auth({ onlyTheOwner: true }), validator({ Dto: UpdateUserPasswordDto })], usersController.updatePassword);
router.delete('/:id', [auth({ onlyTheOwner: true })], usersController.delete);

export default router;
