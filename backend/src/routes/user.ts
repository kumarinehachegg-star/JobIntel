import { Router } from 'express';
import { updateUser, getUser } from '../controllers/userController';

const router = Router();

router.get('/:id', getUser);
router.put('/:id', updateUser);

export default router;
