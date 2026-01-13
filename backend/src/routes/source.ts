import express from 'express';
import {
  listSources,
  getSource,
  createSource,
  updateSource,
  deleteSource,
} from '../controllers/sourceController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Admin-protected routes
router.get('/sources', authenticateToken, requireRole('admin'), listSources);
router.post('/sources', authenticateToken, requireRole('admin'), createSource);
router.get('/sources/:id', authenticateToken, requireRole('admin'), getSource);
router.put('/sources/:id', authenticateToken, requireRole('admin'), updateSource);
router.delete('/sources/:id', authenticateToken, requireRole('admin'), deleteSource);

export default router;
