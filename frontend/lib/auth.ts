const ACCESS_TOKEN_KEY = 'velocity_access_token';
const REFRESH_TOKEN_KEY = 'velocity_refresh_token';
const TENANT_KEY = 'velocity_active_tenant';

function canUseStorage(): boolean {
  return typeof window !== 'undefined';
}

// ── Access Token ──────────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setToken(token: string): void {
  if (!canUseStorage()) return
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
  // Middleware can't read localStorage — set a presence cookie so it knows user is authed
  document.cookie = `velocity_authed=1; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
}

export function clearToken(): void {
  if (!canUseStorage()) return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  document.cookie = `velocity_authed=; path=/; max-age=0; SameSite=Lax`
}

// ── Refresh Token ─────────────────────────────────────────────────────────────

export function getRefreshToken(): string | null {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearRefreshToken(): void {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
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