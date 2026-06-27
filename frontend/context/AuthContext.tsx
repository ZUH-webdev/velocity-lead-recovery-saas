'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getToken,
  setToken,
  clearToken,
  getActiveTenantId,
  setActiveTenantId,
  clearActiveTenantId,
  setRefreshToken,
  getRefreshToken,
  clearRefreshToken,
} from '../lib/auth';
import { api } from '../lib/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [activeTenantId, setActiveTenantIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshAccessToken = async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const res = await api.post('/auth/refresh', { refreshToken });
      const payload = res.data?.data;
      if (!payload?.accessToken) throw new Error('No token returned');

      setToken(payload.accessToken);
      if (payload.refreshToken) setRefreshToken(payload.refreshToken); // rotate
      setAccessToken(payload.accessToken);
    } catch (err) {
      clearToken();
      clearRefreshToken();
      setUser(null);
      setAccessToken(null);
      throw err;
    }
  };

  const fetchMe = async () => {
    try {
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
    } catch (err) {
      throw err;
    }
  };

  // AuthContext.tsx — login()
  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const payload = res.data?.data;

    if (payload?.accessToken) {
      setToken(payload.accessToken);
      setRefreshToken(payload.refreshToken);
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
      await api.post('/auth/logout', { refreshToken: getRefreshToken() });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearToken();
      clearRefreshToken(); // ← clear it
      clearActiveTenantId();
      setUser(null);
      setAccessToken(null);
      setActiveTenantIdState(null);
      router.push('/sign-in');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No token found');
        }
        await fetchMe();
      } catch (err) {
        // If 401 or no token, try to refresh
        try {
          await refreshAccessToken();
          await fetchMe();
        } catch (refreshErr) {
          clearToken();
          clearActiveTenantId();
          setUser(null);
          setAccessToken(null);
          setActiveTenantIdState(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

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
