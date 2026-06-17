import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';
import { extractAuthData } from '../lib/apiClient';
import {
  clearAuthSession,
  getStoredAuthSession,
  setAuthSession,
  subscribeAuthSession,
} from '../utils/authSession';
import { clearToken, setToken } from '../../lib/auth';
import type { AxiosError } from 'axios';
import type { AuthRequestConfig } from '../lib/apiClient';
import type { AuthRegisterResponse, AuthPayload, AuthUser, AuthSession } from '../types';

interface SignUpInput {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  phone?: string;
  industry?: string;
  tenant?: unknown;
  workspace?: unknown;
  businessId?: string;
  remember?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  signUp: (
    inputOrEmail: SignUpInput | string,
    password?: string,
    fullName?: string,
    options?: Partial<SignUpInput>,
  ) => Promise<AuthRegisterResponse | null>;
  signIn: (email: string, password: string, options?: { remember?: boolean }) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getAuthErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ error?: string }>;
  return axiosError?.response?.data?.error || axiosError?.message || (error instanceof Error ? error.message : 'Authentication failed');
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to cross-tab session changes (safe to register on client only)
    const unsubscribe = subscribeAuthSession((session: AuthSession | null) => {
      setUser(session?.user || null);
      setAccessToken(session?.accessToken || null);
    });

    let active = true;

    const bootstrapSession = async () => {
      // Only access localStorage/session helpers on the client
      const initialSession = typeof window !== 'undefined' ? getStoredAuthSession() : null;

      if (initialSession?.accessToken) {
        setUser(initialSession.user || null);
        setAccessToken(initialSession.accessToken || null);
        setToken(initialSession.accessToken, initialSession.remember);
        setLoading(false);
        return;
      }

      try {
        const response = await api.post<AuthPayload>('/auth/refresh', {}, { skipAuthRefresh: true } as AuthRequestConfig);
        const payload = extractAuthData(response.data) as AuthPayload;

        if (payload.accessToken) {
          setAuthSession({
            user: payload.user || null,
            accessToken: payload.accessToken,
            remember: true,
          });
          setToken(payload.accessToken, true);
        }
      } catch (bootstrapError) {
        // clear any possibly stale session state on failure
        if (typeof window !== 'undefined') clearAuthSession();
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    // Only run bootstrap on client
    if (typeof window !== 'undefined') bootstrapSession();

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signUp = async (
    inputOrEmail: SignUpInput | string,
    password?: string,
    fullName?: string,
    options: Partial<SignUpInput> = {},
  ): Promise<AuthRegisterResponse | null> => {
    try {
      setError(null);
      const isObjectPayload = inputOrEmail !== null && typeof inputOrEmail === 'object';
      const registrationInput = isObjectPayload
        ? inputOrEmail
        : {
            email: inputOrEmail,
            password,
            fullName,
            ...options,
          };

      const response = await api.post<AuthRegisterResponse>(
        '/auth/register',
        {
          email: registrationInput.email,
          password: registrationInput.password ?? password,
          fullName: registrationInput.fullName ?? fullName,
          companyName: registrationInput.companyName,
          phone: registrationInput.phone,
          industry: registrationInput.industry,
          tenant: registrationInput.tenant,
          workspace: registrationInput.workspace,
          businessId: registrationInput.businessId,
        },
        { skipAuthRefresh: true } as AuthRequestConfig,
      );
      return extractAuthData(response.data) as AuthRegisterResponse;
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err));
      throw err;
    }
  };

  const signIn = async (email: string, password: string, options: { remember?: boolean } = {}): Promise<AuthUser | null> => {
    try {
      setError(null);
      const response = await api.post<AuthPayload>('/auth/login', { email, password }, { skipAuthRefresh: true } as AuthRequestConfig);
      const payload = extractAuthData(response.data) as AuthPayload;

      if (payload.accessToken) {
        setAuthSession({
          user: payload.user || null,
          accessToken: payload.accessToken,
          remember: options.remember ?? false,
        });
        setToken(payload.accessToken, options.remember ?? false);
      }

      return payload.user || null;
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err));
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await api.post('/auth/logout', {}, { skipAuthRefresh: true } as AuthRequestConfig);
    } catch (err: unknown) {
      setError(getAuthErrorMessage(err));
    } finally {
      clearAuthSession();
      clearToken();
    }
  };

  const value = {
    user,
    accessToken,
    loading,
    error,
    signUp,
    signIn,
    logout,
    isAuthenticated: !!accessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
