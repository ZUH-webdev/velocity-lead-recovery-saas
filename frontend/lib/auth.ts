const TOKEN_KEY = 'velocity_token';
const TOKEN_COOKIE = 'velocity_token';

function canUseStorage(): boolean {
  return typeof window !== 'undefined';
}

export function getToken(): string | null {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string, remember = true): void {
  if (!canUseStorage()) return;

  window.localStorage.setItem(TOKEN_KEY, token);

  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearToken(): void {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
