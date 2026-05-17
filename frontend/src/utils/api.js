import axios from 'axios';
import { clearAuthSession, getAccessToken, getStoredAuthSession, setAuthSession } from './authSession';

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_URL = API_ORIGIN.endsWith('/api') ? API_ORIGIN : `${API_ORIGIN.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = api
      .post('/auth/refresh', {}, { skipAuthRefresh: true })
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
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
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
  async (error) => {
    const originalRequest = error.config || {};
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
