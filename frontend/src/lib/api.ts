import axios from 'axios';
import { clearSession, getToken } from '@/lib/auth';
import type { Application, ApplicationStatus, NewApplication, Summary } from '@/types/application';
import type { AuthResponse, Credentials } from '@/types/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== 'undefined' &&
      window.location.pathname.startsWith('/applications')
    ) {
      clearSession();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const register = async (credentials: Credentials): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', credentials);
  return data;
};

export const login = async (credentials: Credentials): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials);
  return data;
};

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