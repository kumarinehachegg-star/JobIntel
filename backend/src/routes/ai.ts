import express from 'express';
import { parseJobController, matchController, coverController } from '../controllers/aiController';

const router = express.Router();

router.post('/parse', parseJobController);
router.post('/match', matchController);
router.post('/cover', coverController);

export default router;
