import express from 'express';

import controllers from '../controllers/tokens';
import { CreateTokenDto } from '../dto/create-token.dto';
import { validator } from '../middlewares/validator';

const router = express.Router();

router.post('/', [validator({ Dto: CreateTokenDto })], controllers.create);

export default router;
