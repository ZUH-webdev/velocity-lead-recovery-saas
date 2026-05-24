import type { AxiosError } from 'axios';
import { apiClient, extractAuthData, getAuth, postAuth, getAuthTokenStorage, type AuthRequestConfig } from '../lib/apiClient';
import type {
  AuthMessageResponse,
  AuthTokenResponse,
  AuthUserResponse,
  LoginRequest,
  LogoutRequest,
  RefreshRequest,
  RegisterRequest,
  VerifyRequest,
} from '../types/auth';

function getAuthErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string; error?: string; details?: unknown }>;
  return (
    axiosError?.response?.data?.message ||
    axiosError?.response?.data?.error ||
    axiosError?.message ||
    (error instanceof Error ? error.message : 'Authentication request failed')
  );
}

function rethrowAuthError(error: unknown): never {
  const normalizedError = new Error(getAuthErrorMessage(error));
  (normalizedError as Error & { cause?: unknown }).cause = error;
  throw normalizedError;
}

function syncStoredTokens(payload: AuthTokenResponse): void {
  getAuthTokenStorage().setTokens({
    user: payload.user,
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  });
}

export async function register(input: RegisterRequest, config?: AuthRequestConfig): Promise<AuthTokenResponse> {
  try {
    const payload = await postAuth<RegisterRequest, AuthTokenResponse>('/auth/register', input, config);
    syncStoredTokens(payload);
    return payload;
  } catch (error) {
    rethrowAuthError(error);
  }
}

export async function login(input: LoginRequest, config?: AuthRequestConfig): Promise<AuthTokenResponse> {
  try {
    const payload = await postAuth<LoginRequest, AuthTokenResponse>('/auth/login', input, config);
    syncStoredTokens(payload);
    return payload;
  } catch (error) {
    rethrowAuthError(error);
  }
}

export async function me(config?: AuthRequestConfig): Promise<AuthUserResponse> {
  try {
    return await getAuth<AuthUserResponse>('/auth/me', config);
  } catch (error) {
    rethrowAuthError(error);
  }
}

export async function verify(input: VerifyRequest, config?: AuthRequestConfig): Promise<AuthUserResponse> {
  try {
    const response = await apiClient.post<AuthUserResponse>('/auth/verify', { refreshToken: input.refreshToken }, {
      ...config,
      params: { ...(config?.params || {}), token: input.token },
    });

    return extractAuthData<AuthUserResponse>(response.data);
  } catch (error) {
    rethrowAuthError(error);
  }
}

export async function refresh(input: RefreshRequest, config?: AuthRequestConfig): Promise<AuthTokenResponse> {
  try {
    const payload = await postAuth<RefreshRequest, AuthTokenResponse>('/auth/refresh', input, config);
    syncStoredTokens(payload);
    return payload;
  } catch (error) {
    rethrowAuthError(error);
  }
}

export async function logout(input: LogoutRequest, config?: AuthRequestConfig): Promise<AuthMessageResponse> {
  try {
    const payload = await postAuth<LogoutRequest, AuthMessageResponse>('/auth/logout', input, config);
    getAuthTokenStorage().setTokens({ accessToken: null, refreshToken: null, user: null });
    return payload;
  } catch (error) {
    getAuthTokenStorage().setTokens({ accessToken: null, refreshToken: null, user: null });
    rethrowAuthError(error);
  }
}

export const authService = {
  register,
  login,
  me,
  verify,
  refresh,
  logout,
};

export default authService;
