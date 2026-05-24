import type { AuthSession, AuthSessionInput, AuthSessionListener } from '../types';

const STORAGE_KEY = 'velocity.auth.session';

let currentSession: AuthSession | null = null;
const listeners = new Set<AuthSessionListener>();

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

function readSession(storage: Storage | null | undefined): AuthSession | null {
  if (!storage) return null;

  try {
    const value = storage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as AuthSession) : null;
  } catch (error) {
    return null;
  }
}

function writeSession(storage: Storage | null | undefined, session: AuthSession): void {
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    // Ignore storage failures.
  }
}

function clearSession(storage: Storage | null | undefined): void {
  if (!storage) return;

  try {
    storage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Ignore storage failures.
  }
}

function emit(): void {
  listeners.forEach((listener) => listener(currentSession));
}

export function getStoredAuthSession(): AuthSession | null {
  if (currentSession) {
    return currentSession;
  }

  if (!canUseStorage()) {
    return null;
  }

  currentSession = readSession(window.sessionStorage) || readSession(window.localStorage);
  return currentSession;
}

export function getAccessToken() {
  return getStoredAuthSession()?.accessToken || null;
}

export function setAuthSession({ user, accessToken, refreshToken, remember = false }: AuthSessionInput): AuthSession {
  currentSession = {
    user: user || null,
    accessToken: accessToken || null,
    refreshToken: refreshToken ?? currentSession?.refreshToken ?? null,
    remember: Boolean(remember),
    updatedAt: Date.now(),
  };

  if (canUseStorage()) {
    clearSession(window.sessionStorage);
    clearSession(window.localStorage);

    if (accessToken) {
      const storage = remember ? window.localStorage : window.sessionStorage;
      writeSession(storage, currentSession);
    }
  }

  emit();
  return currentSession;
}

export function clearAuthSession(): void {
  currentSession = null;

  if (canUseStorage()) {
    clearSession(window.sessionStorage);
    clearSession(window.localStorage);
  }

  emit();
}

export function subscribeAuthSession(listener: AuthSessionListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}