import { create } from 'zustand';

interface ApplicationState {
  applications: Record<string, any>; // jobId -> application
  setApplications: (map: Record<string, any>) => void;
  addOrUpdateApplication: (app: any) => void;
  removeApplicationByJobId: (jobId: string) => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: {},
  setApplications: (map) => set({ applications: map }),
  addOrUpdateApplication: (app) => set((state) => ({ applications: { ...state.applications, [String(app.jobId)]: app } })),
  removeApplicationByJobId: (jobId) => set((state) => {
    const copy = { ...state.applications };
    delete copy[String(jobId)];
    return { applications: copy };
  }),
}));
