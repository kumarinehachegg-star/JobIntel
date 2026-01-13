import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { 
  listPendingJobs, 
  approveJob, 
  revenueReport, 
  auditLogs, 
  gdprDeleteUser, 
  runCrawlers,
  getAdminStats,
  getJobAnalytics,
  getUserAnalytics,
  getRevenueAnalytics,
  getNotifications,
} from '../controllers/adminController';
import {
  listAdminSkills,
  createAdminSkill,
  deleteAdminSkill,
  listProfileFields,
  createProfileField,
  updateProfileField,
  deleteProfileField,
} from '../controllers/adminSettingsController';

const router = express.Router();

// Stats endpoints
router.get('/stats', authenticateToken, requireRole('admin'), getAdminStats);
router.get('/analytics/jobs', authenticateToken, requireRole('admin'), getJobAnalytics);
router.get('/analytics/users', authenticateToken, requireRole('admin'), getUserAnalytics);
router.get('/analytics/revenue', authenticateToken, requireRole('admin'), getRevenueAnalytics);
router.get('/notifications', authenticateToken, requireRole('admin'), getNotifications);

// Existing endpoints
router.get('/jobs/pending', authenticateToken, requireRole('admin'), listPendingJobs);
router.post('/jobs/:id/approve', authenticateToken, requireRole('admin'), approveJob);
router.get('/reports/revenue', authenticateToken, requireRole('admin'), revenueReport);
router.get('/audit', authenticateToken, requireRole('admin'), auditLogs);
router.delete('/gdpr/delete-user/:id', authenticateToken, requireRole('admin'), gdprDeleteUser);
router.post('/scrape/run', authenticateToken, requireRole('admin'), runCrawlers);

// Admin-managed skills
router.get('/skills', authenticateToken, requireRole('admin'), listAdminSkills);
router.post('/skills', authenticateToken, requireRole('admin'), createAdminSkill);
router.delete('/skills/:id', authenticateToken, requireRole('admin'), deleteAdminSkill);

// Admin-managed profile fields
router.get('/profile-fields', authenticateToken, requireRole('admin'), listProfileFields);
router.post('/profile-fields', authenticateToken, requireRole('admin'), createProfileField);
router.put('/profile-fields/:id', authenticateToken, requireRole('admin'), updateProfileField);
router.delete('/profile-fields/:id', authenticateToken, requireRole('admin'), deleteProfileField);

export default router;
