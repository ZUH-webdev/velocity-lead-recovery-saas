import {
  getToken, getActiveTenantId, setToken, clearToken,
  getRefreshToken, setRefreshToken, clearRefreshToken,
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
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token available');

      const response = await api.post('/auth/refresh', { refreshToken });
      const payload = response.data?.data;
      if (!payload?.accessToken) throw new Error('No access token returned');

      setToken(payload.accessToken);
      if (payload.refreshToken) setRefreshToken(payload.refreshToken); // rotate
      processQueue(null, payload.accessToken);
      originalRequest.headers['Authorization'] = `Bearer ${payload.accessToken}`;
      return api.request(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearToken();
      clearRefreshToken();
      clearActiveTenantId();
      window.location.href = '/sign-in';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);