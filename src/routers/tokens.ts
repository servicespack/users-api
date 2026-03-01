import express from 'express';

import { TokensController } from '../controllers/tokens.controller';
import { CreateTokenDto } from '../dto/create-token.dto';
import { validator } from '../middlewares/validator';
import { UserRepository } from '../repositories/user.repository';
import { knex } from '../start/database';

const router = express.Router();
const userRepository = new UserRepository(knex);
const tokensController = new TokensController(userRepository);

router.post('/', [validator({ Dto: CreateTokenDto })], tokensController.create);

export default router;
