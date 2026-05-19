import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';
import {
  clearAuthSession,
  getStoredAuthSession,
  setAuthSession,
  subscribeAuthSession,
} from '../utils/authSession';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Subscribe to cross-tab session changes (safe to register on client only)
    const unsubscribe = subscribeAuthSession((session) => {
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
        setLoading(false);
        return;
      }

      try {
        const response = await api.post('/auth/refresh', {}, { skipAuthRefresh: true });
        const payload = response.data?.data || {};

        if (payload.accessToken) {
          setAuthSession({
            user: payload.user || null,
            accessToken: payload.accessToken,
            remember: true,
          });
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

  const signUp = async (inputOrEmail, password, fullName, options = {}) => {
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

      const response = await api.post(
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
        { skipAuthRefresh: true },
      );
      const payload = response.data?.data || {};

      if (payload.accessToken) {
        setAuthSession({
          user: payload.user || null,
          accessToken: payload.accessToken,
          remember: (isObjectPayload ? registrationInput.remember : options.remember) ?? true,
        });
      }

      return payload.user || null;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  const signIn = async (email, password, options = {}) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password }, { skipAuthRefresh: true });
      const payload = response.data?.data || {};

      if (payload.accessToken) {
        setAuthSession({
          user: payload.user || null,
          accessToken: payload.accessToken,
          remember: options.remember ?? false,
        });
      }

      return payload.user || null;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await api.post('/auth/logout', {}, { skipAuthRefresh: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      clearAuthSession();
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
