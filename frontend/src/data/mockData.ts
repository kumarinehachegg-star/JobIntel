import { Job, Company, User, Application } from '@/types';

// Empty arrays for companies and jobs - add real data here
export const mockCompanies: Company[] = [];

export const mockJobs: Job[] = [];


export const mockUser: User = {
  id: '1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  tier: 'premium',
  phone: '+91 98765 43210',
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
  experience: 4,
  preferredLocations: ['Bangalore', 'Hyderabad', 'Remote'],
  preferredRoles: ['Frontend Engineer', 'Full Stack Developer'],
  createdAt: '2023-06-15',
  notificationPreferences: {
    email: true,
    whatsapp: true,
    telegram: false,
    newJobMatch: true,
    deadlineReminder: true,
    applicationUpdate: true,
    referralUpdate: true,
  },
};

export const mockApplications: Application[] = [];

