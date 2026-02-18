import express from 'express';

import { VerificationsController } from '../controllers/verifications.controller';
import { orm } from '../start/database';

const router = express.Router();
const verificationsController = new VerificationsController(orm.em.fork());

router.post('/', verificationsController.create);

export default router;
