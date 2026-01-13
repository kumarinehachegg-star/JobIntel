// Admin Dashboard Types

export interface AdminStats {
  totalJobs: number;
  activeJobs: number;
  totalUsers: number;
  premiumUsers: number;
  ultraUsers: number;
  applicationsToday: number;
  notificationsSent: number;
  revenue: number;
}

export interface AdminJob {
  id: string;
  title: string;
  company: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'expired';
  applicants: number;
  postedAt: string;
  deadline?: string;
  source: 'manual' | 'crawler' | 'api';
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  channels: ('email' | 'whatsapp' | 'telegram')[];
  targetAudience: 'all' | 'free' | 'premium' | 'ultra';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduledAt?: string;
  sentAt?: string;
  recipientCount?: number;
}

export interface UserAnalytics {
  date: string;
  free: number;
  premium: number;
  ultra: number;
}

export interface JobAnalytics {
  date: string;
  posted: number;
  applications: number;
}

export interface RevenueAnalytics {
  date: string;
  subscriptions: number;
  ads: number;
  referrals: number;
}
