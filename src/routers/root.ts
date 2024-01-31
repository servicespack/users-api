import express from 'express';

import controllers from '../controllers/root';

const router = express.Router();

router.get('/', controllers.get);

export default router;
