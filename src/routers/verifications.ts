import express from 'express';

import { VerificationsController } from '../controllers/verifications.controller';
import { UserRepository } from '../repositories/user.repository';
import { knex } from '../start/database';

const router = express.Router();
const userRepository = new UserRepository(knex);
const verificationsController = new VerificationsController(userRepository);

router.post('/', verificationsController.create);

export default router;
