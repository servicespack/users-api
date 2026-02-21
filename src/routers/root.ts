import express from 'express';

import { RootController } from '../controllers/root.controller';

const router = express.Router();
const rootController = new RootController();

router.get('/', rootController.get);

export default router;
