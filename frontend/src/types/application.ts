export const STATUSES = ['applied', 'interview', 'offer', 'rejected'] as const;

export type ApplicationStatus = (typeof STATUSES)[number];

export interface Application {
  _id: string;
  company: string;
  position: string;
  link?: string;
  status: ApplicationStatus;
  appliedAt: string;
  recruiterName?: string;
  recruiterContact?: string;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewApplication {
  company: string;
  position: string;
  link: string;
  status: ApplicationStatus;
  appliedAt: string;
}