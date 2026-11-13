import axios from 'axios';
import type { Application, ApplicationStatus, NewApplication, Summary } from '@/types/application';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const fetchApplications = async (status?: ApplicationStatus): Promise<Application[]> => {
  const { data } = await api.get<Application[]>('/applications', {
    params: status ? { status } : {},
  });
  return data;
};

export const fetchSummary = async (): Promise<Summary> => {
  const { data } = await api.get<Summary>('/applications/summary');
  return data;
};

export const createApplication = async (values: NewApplication): Promise<Application> => {
  const { data } = await api.post<Application>('/applications', values);
  return data;
};

export const updateApplication = async (
  id: string,
  changes: Partial<NewApplication>,
): Promise<Application> => {
  const { data } = await api.patch<Application>(`/applications/${id}`, changes);
  return data;
};