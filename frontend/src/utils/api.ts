import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { clearAuthSession, getAccessToken, getStoredAuthSession, setAuthSession } from './authSession';
import type { ApiEnvelope, AuthPayload, CalendarStatus, Lead } from '../types';

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_URL = API_ORIGIN.endsWith('/api') ? API_ORIGIN : `${API_ORIGIN.replace(/\/$/, '')}/api`;

type AuthRequestConfig = AxiosRequestConfig & {
  skipAuthRefresh?: boolean;
  _retry?: boolean;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<AuthPayload> | null = null;

async function refreshAccessToken(): Promise<AuthPayload> {
  if (!refreshPromise) {
    refreshPromise = api
      .post<ApiEnvelope<AuthPayload>>('/auth/refresh', {}, { skipAuthRefresh: true } as AuthRequestConfig)
      .then((response) => {
        const payload = response.data?.data || {};

        if (payload.accessToken) {
          const session = getStoredAuthSession();
          setAuthSession({
            user: payload.user || session?.user || null,
            accessToken: payload.accessToken,
            remember: session?.remember ?? true,
          });
        }

        return payload;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use((config) => {
  const requestConfig = config as AuthRequestConfig & { headers?: Record<string, string> };
  const token = getAccessToken();

  if (token) {
    requestConfig.headers = requestConfig.headers || {};
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  return requestConfig;
});

// Leads API
export const leadsAPI = {
  getAll: () => api.get<Lead[]>('/leads'),
  getById: (id: string) => api.get<Lead>(`/leads/${id}`),
  updateScore: (id: string, score: number) => api.patch<Lead>(`/leads/${id}/score`, { score }),
  escalateToHuman: (id: string) => api.post(`/leads/${id}/escalate`),
};

// Calendar API
export const calendarAPI = {
  getStatus: () => api.get<CalendarStatus>('/calendar/status'),
  getSlots: (date: string) => api.get('/calendar/slots', { params: { date } }),
  syncCalendar: () => api.post('/calendar/sync'),
  updateTimezone: (timezone: string) => api.patch('/calendar/timezone', { timezone }),
};

// Health check
export const systemAPI = {
  health: () => api.get('/health'),
};

// Error handling middleware
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = (error.config || {}) as AuthRequestConfig;
    const status = error.response?.status;

    if (originalRequest.skipAuthRefresh || originalRequest._retry || status !== 401) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }

    originalRequest._retry = true;

    try {
      await refreshAccessToken();
      return api(originalRequest);
    } catch (refreshError) {
      clearAuthSession();
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  }
);

export default api;
