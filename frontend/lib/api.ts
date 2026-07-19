import {
  getToken, getActiveTenantId, setToken, clearToken,
  clearActiveTenantId
} from './auth'
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = getToken();
  const tenantId = getActiveTenantId();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  if (tenantId) config.headers['X-Tenant-ID'] = tenantId;
  return config;
}, (error) => Promise.reject(error));

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api.request(originalRequest);
      }).catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // No body needed — the refresh token lives in the httpOnly cookie,
      // sent automatically because the client is configured with withCredentials.
      const response = await api.post('/auth/refresh');
      const payload = response.data?.data;
      if (!payload?.accessToken) throw new Error('No access token returned');

      setToken(payload.accessToken);
      processQueue(null, payload.accessToken);
      originalRequest.headers['Authorization'] = `Bearer ${payload.accessToken}`;
      return api.request(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearToken();
      clearActiveTenantId();
      window.location.href = '/sign-in';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);