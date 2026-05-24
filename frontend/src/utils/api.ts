import { apiClient } from '../lib/apiClient';
import type { CalendarStatus, Lead } from '../types';

// Leads API
export const leadsAPI = {
  getAll: () => apiClient.get<Lead[]>('/leads'),
  getById: (id: string) => apiClient.get<Lead>(`/leads/${id}`),
  updateScore: (id: string, score: number) => apiClient.patch<Lead>(`/leads/${id}/score`, { score }),
  escalateToHuman: (id: string) => apiClient.post(`/leads/${id}/escalate`),
};

// Calendar API
export const calendarAPI = {
  getStatus: () => apiClient.get<CalendarStatus>('/calendar/status'),
  getSlots: (date: string) => apiClient.get('/calendar/slots', { params: { date } }),
  syncCalendar: () => apiClient.post('/calendar/sync'),
  updateTimezone: (timezone: string) => apiClient.patch('/calendar/timezone', { timezone }),
};

// Health check
export const systemAPI = {
  health: () => apiClient.get('/health'),
};

export default apiClient;
