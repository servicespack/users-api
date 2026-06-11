import express from 'express';

import { VerificationsController } from '../controllers/verifications.controller';
import { User } from '../entities/user';

const router = express.Router();
const verificationsController = new VerificationsController(User);

router.post('/', verificationsController.create);

export default router;
