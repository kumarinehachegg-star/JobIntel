import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Job, JobStatus } from '@/types';

interface ParsedJob {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  isRemote: boolean;
  salary?: string;
  stipend?: string;
  techStack: string[];
  tags: string[];
  eligibility?: string;
  experience?: string;
  batch?: string[];
  status: JobStatus;
  rawText: string;
  createdAt: string;
}

interface JobsState {
  publishedJobs: ParsedJob[];
  publishJob: (job: Omit<ParsedJob, 'id' | 'createdAt'>) => void;
  removeJob: (id: string) => void;
  updateJobStatus: (id: string, status: JobStatus) => void;
  clearAllJobs: () => void;
}

// Clear any existing jobs from localStorage on app start
if (typeof window !== 'undefined') {
  localStorage.removeItem('jobs-storage');
}

export const useJobsStore = create<JobsState>()(
  persist(
    (set) => ({
      publishedJobs: [],

      publishJob: (job) => {
        const newJob: ParsedJob = {
          ...job,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          publishedJobs: [newJob, ...state.publishedJobs],
        }));
      },

      removeJob: (id) => {
        set((state) => ({
          publishedJobs: state.publishedJobs.filter(job => job.id !== id),
        }));
      },

      updateJobStatus: (id, status) => {
        set((state) => ({
          publishedJobs: state.publishedJobs.map(job =>
            job.id === id ? { ...job, status } : job
          ),
        }));
      },

      clearAllJobs: () => {
        set({ publishedJobs: [] });
      },
    }),
    {
      name: 'jobs-storage',
    }
  )
);
