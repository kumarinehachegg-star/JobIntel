import { AdminStats, AdminJob, AdminNotification, UserAnalytics, JobAnalytics, RevenueAnalytics } from '@/types/admin';

// Empty stats - add real data here
export const adminStats: AdminStats = {
  totalJobs: 0,
  activeJobs: 0,
  totalUsers: 0,
  premiumUsers: 0,
  ultraUsers: 0,
  applicationsToday: 0,
  notificationsSent: 0,
  revenue: 0,
};

// Empty admin jobs - add real data here
export const adminJobs: AdminJob[] = [];

// Empty notifications - add real data here
export const adminNotifications: AdminNotification[] = [];

// Empty user analytics - add real data here
export const userAnalytics: UserAnalytics[] = [];

// Empty job analytics - add real data here
export const jobAnalytics: JobAnalytics[] = [];

// Empty revenue analytics - add real data here
export const revenueAnalytics: RevenueAnalytics[] = [];

