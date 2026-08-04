import { AxiosError } from 'axios';

const GENERIC_FALLBACK = 'Something went wrong. Please try again.';
const NETWORK_FALLBACK = "Can't connect right now. Please check your internet and try again.";

// True only when the request never reached the server (no response at all) —
// once the server has responded, its message is always preferred instead.
export function isNetworkError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'response' in error && (error as AxiosError).response) {
    return false;
  }

  const msg = error instanceof Error ? error.message.toLowerCase() : '';
  return msg.includes('network') || msg.includes('fetch failed') || msg.includes('err_connection');
}

function extractServerMessage(error: unknown): string | undefined {
  const data = (error as AxiosError<{ message?: string }> | undefined)?.response?.data;
  const message = data?.message;
  return typeof message === 'string' && message.trim() ? message : undefined;
}

// Turns any thrown value from an API call into a message safe to show a user.
// Backend responses are expected to already carry a human-readable `message`
// (see backend/src/services/auth.service.ts and tenant.service.ts) — this is
// mainly a safety net for network failures and unexpected/raw errors.
export function getFriendlyError(error: unknown): string {
  if (isNetworkError(error)) return NETWORK_FALLBACK;

  const serverMessage = extractServerMessage(error);
  if (serverMessage) return serverMessage;

  if (error instanceof Error && error.message) return error.message;

  return GENERIC_FALLBACK;
}
