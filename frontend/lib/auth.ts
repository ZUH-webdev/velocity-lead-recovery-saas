// Access token lives in memory only — never persisted to localStorage.
// The refresh token lives exclusively in the backend's httpOnly cookie and
// is never exposed to client-side JS. A presence-only flag is kept in
// localStorage/cookie so the proxy and the app can tell "was logged in"
// apart from "never logged in" without being able to read a real token.

const AUTHED_FLAG_KEY = 'velocity_authed';
const TENANT_KEY = 'velocity_active_tenant';

export function canUseStorage(): boolean {
  return typeof window !== 'undefined';
}

// ── Access Token (in-memory only) ───────────────────────────────────────────

let inMemoryToken: string | null = null;

export function getToken(): string | null {
  return inMemoryToken;
}

export function setToken(token: string): void {
  inMemoryToken = token;
  if (!canUseStorage()) return;
  // Presence flag only — the token itself is never written to storage.
  window.localStorage.setItem(AUTHED_FLAG_KEY, '1');
  document.cookie = `velocity_authed=1; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

export function clearToken(): void {
  inMemoryToken = null;
  if (!canUseStorage()) return;
  window.localStorage.removeItem(AUTHED_FLAG_KEY);
  document.cookie = `velocity_authed=; path=/; max-age=0; SameSite=Lax`;
}

export function isAuthFlagSet(): boolean {
  if (!canUseStorage()) return false;
  return window.localStorage.getItem(AUTHED_FLAG_KEY) === '1';
}

// ── Tenant ────────────────────────────────────────────────────────────────────

export function getActiveTenantId(): string | null {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(TENANT_KEY);
}

export function setActiveTenantId(tenantId: string): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(TENANT_KEY, tenantId);
}

export function clearActiveTenantId(): void {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(TENANT_KEY);
}
