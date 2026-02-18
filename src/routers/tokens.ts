import express from 'express';

import { TokensController } from '../controllers/tokens.controller';
import { CreateTokenDto } from '../dto/create-token.dto';
import { User } from '../entities/user';
import { validator } from '../middlewares/validator';
import { orm } from '../start/database';

const router = express.Router();
const tokensController = new TokensController(orm.em.fork().getRepository(User));

router.post('/', [validator({ Dto: CreateTokenDto })], tokensController.create);

export default router;
