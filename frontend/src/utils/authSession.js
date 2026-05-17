const STORAGE_KEY = 'velocity.auth.session';

let currentSession = null;
const listeners = new Set();

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

function readSession(storage) {
  if (!storage) return null;

  try {
    const value = storage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

function writeSession(storage, session) {
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    // Ignore storage failures.
  }
}

function clearSession(storage) {
  if (!storage) return;

  try {
    storage.removeItem(STORAGE_KEY);
  } catch (error) {
    // Ignore storage failures.
  }
}

function emit() {
  listeners.forEach((listener) => listener(currentSession));
}

export function getStoredAuthSession() {
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

export function setAuthSession({ user, accessToken, remember = false }) {
  currentSession = {
    user: user || null,
    accessToken: accessToken || null,
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

export function clearAuthSession() {
  currentSession = null;

  if (canUseStorage()) {
    clearSession(window.sessionStorage);
    clearSession(window.localStorage);
  }

  emit();
}

export function subscribeAuthSession(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}