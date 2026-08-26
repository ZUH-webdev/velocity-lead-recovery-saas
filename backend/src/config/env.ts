import type { SignOptions } from "jsonwebtoken";

type JwtExpire = NonNullable<SignOptions["expiresIn"]>;

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  NODE_ENV: optional("NODE_ENV", "development"),
  PORT: parseInt(optional("PORT", "3001"), 10),
  DATABASE_URL: required("DATABASE_URL"),
  REDIS_URL: required("REDIS_URL"),
  ACCESS_TOKEN_SECRET: required("ACCESS_TOKEN_SECRET"),
  ACCESS_TOKEN_EXPIRE: (process.env.ACCESS_TOKEN_EXPIRE ?? "15m") as JwtExpire,
  REFRESH_TOKEN_SECRET: required("REFRESH_TOKEN_SECRET"),
  REFRESH_TOKEN_EXPIRE: (process.env.REFRESH_TOKEN_EXPIRE ??
    "30d") as JwtExpire,
  CORS_ORIGIN: optional(
    "CORS_ORIGIN",
    "http://localhost:3000,http://localhost:5173",
  ),
  GOOGLE_CLIENT_ID: required("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: required("GOOGLE_CLIENT_SECRET"),
  GOOGLE_CALLBACK_URL: required("GOOGLE_CALLBACK_URL"),
  RESEND_API_KEY: required("RESEND_API_KEY"),
  APP_URL: optional("APP_URL", "http://localhost:3000"),
  // The backend's own publicly reachable base URL (used to build webhook/OAuth
  // callback URLs) — defaults to stripping the known suffix off GOOGLE_CALLBACK_URL
  // so most deployments don't need to configure yet another URL by hand.
  API_BASE_URL: optional(
    "API_BASE_URL",
    required("GOOGLE_CALLBACK_URL").replace(/\/auth\/google\/callback$/, ""),
  ),
  TWILIO_ACCOUNT_SID: required("TWILIO_ACCOUNT_SID"),
  TWILIO_AUTH_TOKEN: required("TWILIO_AUTH_TOKEN"),
  TWILIO_PHONE_NUMBER: required("TWILIO_PHONE_NUMBER"),
  // 32-byte (64 hex char) key used to encrypt OAuth tokens at rest, e.g. `openssl rand -hex 32`
  TOKEN_ENCRYPTION_KEY: required("TOKEN_ENCRYPTION_KEY"),
  // Separate key for tenant Twilio subaccount credentials — kept independent of
  // TOKEN_ENCRYPTION_KEY so the two credential stores can be rotated independently.
  TWILIO_CREDENTIAL_ENCRYPTION_KEY: required("TWILIO_CREDENTIAL_ENCRYPTION_KEY"),
} as const;

export type Env = typeof env;
