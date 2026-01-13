// Shared TypeScript types for frontend/backend

declare namespace JobScoutTypes {
  export interface Job {
    id: string;
    title: string;
    company: string;
    location?: string;
    description?: string;
    postedAt?: string;
  }
}

export {};
