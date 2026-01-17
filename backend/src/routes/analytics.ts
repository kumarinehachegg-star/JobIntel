import { Router } from "express";
import {
  getVisitorAnalytics,
  getRealtimeVisitors,
  getPageAnalytics,
  trackEvent,
  getUserStats,
  getJobMatchTrends,
  getApplicationStatus,
  getRecentActivity,
} from "../controllers/analyticsController";
import { authenticateToken, requireRole } from "../middleware/auth";

const router = Router();

// User-level analytics (requires authentication only)
router.get("/user-stats", authenticateToken, getUserStats);
router.get("/job-match-trends", authenticateToken, getJobMatchTrends);
router.get("/application-status", authenticateToken, getApplicationStatus);

// Admin analytics (requires admin role)
router.use(requireRole("admin"));

// Get visitor analytics with time range
router.get("/visitors", getVisitorAnalytics);

// Get real-time visitor count
router.get("/realtime", getRealtimeVisitors);

// Get page-specific analytics
router.get("/pages", getPageAnalytics);

// Track custom events
router.post("/track-event", trackEvent);

export default router;
