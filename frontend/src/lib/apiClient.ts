import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import { clearAuthSession, getAccessToken, getStoredAuthSession, setAuthSession } from '../utils/authSession';
import type {
  AuthApiResponse,
  AuthTokenResponse,
  AuthUser,
  RefreshRequest,
} from '../types/auth';

const DEFAULT_TIMEOUT = 10000;
const AUTH_HEADER = 'Authorization';

export interface AuthRequestConfig<D = unknown> extends AxiosRequestConfig<D> {
  skipAuthRefresh?: boolean;
  _retry?: boolean;
}

export interface AuthTokenStorage {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (tokens: {
    user?: AuthUser | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    remember?: boolean;
  }) => void;
  clearTokens: () => void;
}

function normalizeBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/$/, '');
  return trimmed || 'http://localhost:3001/api/v1';
}

function createDefaultTokenStorage(): AuthTokenStorage {
  return {
    getAccessToken: () => getAccessToken(),
    getRefreshToken: () => getStoredAuthSession()?.refreshToken || null,
    setTokens: ({ user, accessToken, refreshToken, remember }) => {
      const currentSession = getStoredAuthSession();

      setAuthSession({
        user: user !== undefined ? user : currentSession?.user ?? null,
        accessToken: accessToken !== undefined ? accessToken : currentSession?.accessToken ?? null,
        refreshToken: refreshToken !== undefined ? refreshToken : currentSession?.refreshToken ?? null,
        remember: remember ?? currentSession?.remember ?? false,
      });
    },
    clearTokens: () => {
      clearAuthSession();
    },
  };
}

const apiBaseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1');

let tokenStorage: AuthTokenStorage = createDefaultTokenStorage();
let refreshPromise: Promise<AuthTokenResponse> | null = null;

export const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: DEFAULT_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthTokenStorage(nextStorage: AuthTokenStorage): void {
  tokenStorage = nextStorage;
}

export function getAuthTokenStorage(): AuthTokenStorage {
  return tokenStorage;
}

export function resetAuthTokenStorage(): void {
  tokenStorage = createDefaultTokenStorage();
}

function unwrapAuthData<T>(response: AuthApiResponse<T> | T): T {
  if (response && typeof response === 'object' && 'data' in response) {
    return ((response as AuthApiResponse<T>).data as T) ?? ({} as T);
  }

  return response as T;
}

function shouldAttemptTokenRefresh(originalRequest: AuthRequestConfig, status?: number): boolean {
  if (originalRequest.skipAuthRefresh || originalRequest._retry || status !== 401) {
    return false;
  }

  const requestUrl = (originalRequest.url || '').toLowerCase();

  if (!requestUrl) {
    return true;
  }

  return !/^\/auth\/(login|register|refresh|logout|verify|verify-email)(?:[/?#]|$)/.test(requestUrl);
}

async function requestRefreshToken(): Promise<AuthTokenResponse> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = tokenStorage.getRefreshToken();
      const payload: Partial<RefreshRequest> = refreshToken ? { refreshToken } : {};

      const response = await apiClient.post<AuthApiResponse<AuthTokenResponse> | AuthTokenResponse>(
        '/auth/refresh',
        payload,
        {
          skipAuthRefresh: true,
        } as AuthRequestConfig,
      );

      const data = unwrapAuthData<AuthTokenResponse>(response.data);

      if (!data.accessToken) {
        throw new Error('Refresh token request did not return an access token');
      }

      tokenStorage.setTokens({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      return data;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken();

  if (token) {
    (config as any).headers = (config as any).headers || {};
    (config as any).headers[AUTH_HEADER] = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = (error.config || {}) as AuthRequestConfig;
    const status = error.response?.status;

    if (!shouldAttemptTokenRefresh(originalRequest, status)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await requestRefreshToken();
      return apiClient(originalRequest);
    } catch (refreshError) {
      tokenStorage.clearTokens();
      return Promise.reject(refreshError instanceof Error ? refreshError : error);
    }
  },
);

export function extractAuthData<T>(response: AuthApiResponse<T> | T): T {
  return unwrapAuthData(response);
}

export async function postAuth<TRequest, TResponse>(
  url: string,
  data: TRequest,
  config?: AuthRequestConfig,
): Promise<TResponse> {
  const response = await apiClient.post<AuthApiResponse<TResponse> | TResponse>(url, data, config);
  return extractAuthData<TResponse>(response.data);
}

export async function getAuth<TResponse>(url: string, config?: AuthRequestConfig): Promise<TResponse> {
  const response = await apiClient.get<AuthApiResponse<TResponse> | TResponse>(url, config);
  return extractAuthData<TResponse>(response.data);
}

export async function putAuth<TRequest, TResponse>(
  url: string,
  data: TRequest,
  config?: AuthRequestConfig,
): Promise<TResponse> {
  const response = await apiClient.put<AuthApiResponse<TResponse> | TResponse>(url, data, config);
  return extractAuthData<TResponse>(response.data);
}

export async function patchAuth<TRequest, TResponse>(
  url: string,
  data: TRequest,
  config?: AuthRequestConfig,
): Promise<TResponse> {
  const response = await apiClient.patch<AuthApiResponse<TResponse> | TResponse>(url, data, config);
  return extractAuthData<TResponse>(response.data);
}

export async function deleteAuth<TResponse>(url: string, config?: AuthRequestConfig): Promise<TResponse> {
  const response = await apiClient.delete<AuthApiResponse<TResponse> | TResponse>(url, config);
  return extractAuthData<TResponse>(response.data);
}

export default apiClient;
