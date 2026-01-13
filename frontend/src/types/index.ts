// User Types
export type UserTier = 'free' | 'premium' | 'ultra';
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  tier: UserTier;
  role?: UserRole;
  avatar?: string;
  phone?: string;
  telegramId?: string;
  skills: string[];
  experience: number;
  preferredLocations: string[];
  preferredRoles: string[];
  createdAt: string;
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  whatsapp: boolean;
  telegram: boolean;
  newJobMatch: boolean;
  deadlineReminder: boolean;
  applicationUpdate: boolean;
  referralUpdate: boolean;
}

// Job Types
export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
export type ExperienceLevel = 'fresher' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';
export type JobStatus = 'active' | 'expired' | 'filled' | 'draft';

export interface Job {
  id: string;
  title: string;
  company: Company;
  location: string;
  isRemote: boolean;
  type: JobType;
  experienceLevel: ExperienceLevel;
  experienceRange: { min: number; max: number };
  salary?: SalaryRange;
  description: string;
  requirements: string[];
  skills: string[];
  batch?: string[];
  eligibility?: string;
  applyLink: string;
  deadline?: string;
  postedAt: string;
  status: JobStatus;
  isHot?: boolean;
  matchScore?: number;
  applicantsCount?: number;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'monthly' | 'yearly';
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  website?: string;
  industry: string;
  size?: string;
  description?: string;
}

// Application Types
export type ApplicationStatus = 'pending' | 'applied' | 'in-review' | 'interview' | 'offered' | 'rejected' | 'withdrawn';

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  userId: string;
  status: ApplicationStatus;
  appliedAt: string;
  resumeVersion?: string;
  coverLetter?: string;
  autoApplied: boolean;
  confirmationId?: string;
  notes?: string;
}

// Referral Types
export type ReferralStatus = 'pending' | 'in-progress' | 'submitted' | 'accepted' | 'rejected' | 'completed';

export interface Referral {
  id: string;
  jobId: string;
  job: Job;
  referrerId: string;
  referrer: {
    name: string;
    company: string;
    verified: boolean;
  };
  seekerId: string;
  status: ReferralStatus;
  price: number;
  createdAt: string;
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super-admin' | 'moderator';
  permissions: string[];
}

// Filter Types
export interface JobFilters {
  search?: string;
  location?: string[];
  type?: JobType[];
  experienceLevel?: ExperienceLevel[];
  skills?: string[];
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  company?: string[];
  postedWithin?: '24h' | '7d' | '30d' | 'all';
}
