import { Router } from 'express';
import { getPublicProfileFields } from '../controllers/profileFieldController';

const router = Router();

router.get('/', getPublicProfileFields);

export default router;
