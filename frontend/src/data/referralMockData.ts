import { Referral } from '@/types';
import { mockJobs } from './mockData';

export interface AdminReferral {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  referrer: {
    id: string;
    name: string;
    email: string;
    company: string;
    verified: boolean;
  };
  seeker: {
    id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'in-progress' | 'submitted' | 'accepted' | 'rejected' | 'completed';
  price: number;
  commission: number;
  createdAt: string;
  updatedAt: string;
  proofUrl?: string;
  notes?: string;
}

// Empty referrals - add real data here
export const adminReferrals: AdminReferral[] = [];

// Empty referral stats - add real data here
export const referralStats = {
  totalReferrals: 0,
  pendingReferrals: 0,
  completedReferrals: 0,
  totalRevenue: 0,
  totalCommissions: 0,
  avgReferralPrice: 0,
  successRate: 0,
  verifiedReferrers: 0,
};

