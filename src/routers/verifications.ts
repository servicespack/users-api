import express from 'express';

import controllers from '../controllers/verifications';
import validators from '../middlewares/validators/verifications';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/', [validators.create], controllers.create);

export default router;
