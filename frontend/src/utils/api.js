import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Leads API
export const leadsAPI = {
  getAll: () => api.get('/leads'),
  getById: (id) => api.get(`/leads/${id}`),
  updateScore: (id, score) => api.patch(`/leads/${id}/score`, { score }),
  escalateToHuman: (id) => api.post(`/leads/${id}/escalate`),
};

// Calendar API
export const calendarAPI = {
  getStatus: () => api.get('/calendar/status'),
  getSlots: (date) => api.get('/calendar/slots', { params: { date } }),
  syncCalendar: () => api.post('/calendar/sync'),
  updateTimezone: (timezone) => api.patch('/calendar/timezone', { timezone }),
};

// Health check
export const systemAPI = {
  health: () => api.get('/health'),
};

// Error handling middleware
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export default api;
