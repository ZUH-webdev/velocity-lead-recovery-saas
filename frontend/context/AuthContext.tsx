'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getToken,
  setToken,
  clearToken,
  isAuthFlagSet,
  getActiveTenantId,
  setActiveTenantId,
  clearActiveTenantId,
} from '../lib/auth';
import { api } from '../lib/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  hasWorkspace?: boolean;
  tenantMembers?: { tenantId: string }[];
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  activeTenantId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  initAuth: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [activeTenantId, setActiveTenantIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const clearAuthState = () => {
    clearToken();
    clearActiveTenantId();
    setUser(null);
    setAccessToken(null);
    setActiveTenantIdState(null);
  };

  // Exchanges the httpOnly refresh-token cookie for a fresh in-memory access
  // token. Used on mount (the access token doesn't survive a page reload,
  // since it's never persisted) — the axios interceptor in lib/api.ts is the
  // single source of truth for mid-session 401 handling.
  const refreshAccessToken = async () => {
    try {
      // No body: the backend reads the refresh token from the httpOnly cookie.
      const res = await api.post('/auth/refresh');
      const payload = res.data?.data;
      if (!payload?.accessToken) throw new Error('No token returned');

      setToken(payload.accessToken);
      setAccessToken(payload.accessToken);
    } catch (err) {
      clearAuthState();
      throw err;
    }
  };

  const fetchMe = async () => {
    const res = await api.get('/auth/me');
    const userData = res.data?.data?.user; // unwrap HttpResponse envelope
    if (!userData) throw new Error('No user returned');

    setUser(userData);
    setAccessToken(getToken());

    let currentTenantId = getActiveTenantId();
    const members = userData.tenantMembers || [];

    if (members.length > 0) {
      const isValid = members.some((m: any) => m.tenantId === currentTenantId);
      if (!currentTenantId || !isValid) {
        currentTenantId = members[0].tenantId;
        if (currentTenantId) setActiveTenantId(currentTenantId);
      }
    } else {
      currentTenantId = null;
      clearActiveTenantId();
    }

    setActiveTenantIdState(currentTenantId);
    return userData;
  };

  // Loads the current user from an access token already set via setToken()
  // (e.g. after the Google OAuth callback page reads it from the redirect URL).
  const initAuth = async () => {
    setAccessToken(getToken());
    return fetchMe();
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const payload = res.data?.data;

    if (payload?.accessToken) {
      setToken(payload.accessToken);
      setAccessToken(payload.accessToken);
      setUser(payload.user);

      const members = payload.user?.tenantMembers || [];
      if (members.length > 0) {
        const firstTenantId = members[0].tenantId;
        setActiveTenantId(firstTenantId);
        setActiveTenantIdState(firstTenantId);
      }

      return payload.user; // ← return user so callers can act on it immediately
    } else {
      throw new Error(res.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      // No body: the backend reads/clears the refresh token via the httpOnly cookie.
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuthState();
      router.push('/sign-in');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // The access token never survives a reload (in-memory only), so on
        // mount we always exchange the httpOnly refresh cookie for a new one
        // when the presence flag suggests the user was previously logged in.
        if (!isAuthFlagSet()) {
          throw new Error('Not previously authenticated');
        }
        await refreshAccessToken();
        await fetchMe();
      } catch (err) {
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Cross-tab sync: another tab logging in/out flips the `velocity_authed`
  // localStorage flag, which fires a `storage` event in every other tab.
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== 'velocity_authed') return;

      if (event.newValue === null) {
        // Another tab logged out — sync this tab.
        clearAuthState();
        router.push('/sign-in');
      } else if (event.newValue === '1' && !user) {
        // Another tab logged in — re-bootstrap this tab's auth state.
        refreshAccessToken().then(fetchMe).catch(() => clearAuthState());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        activeTenantId,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshAccessToken,
        initAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
