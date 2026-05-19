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
  NODE_ENV:              optional("NODE_ENV", "development"),
  PORT:                  parseInt(optional("PORT", "3001"), 10),
  DATABASE_URL:          required("DATABASE_URL"),
  REDIS_URL:             required("REDIS_URL"),
  ACCESS_TOKEN_SECRET:   required("ACCESS_TOKEN_SECRET"),
  ACCESS_TOKEN_EXPIRE:  (process.env.ACCESS_TOKEN_EXPIRE  ?? "15m") as JwtExpire,
  REFRESH_TOKEN_SECRET:  required("REFRESH_TOKEN_SECRET"),
  REFRESH_TOKEN_EXPIRE: (process.env.REFRESH_TOKEN_EXPIRE ?? "30d") as JwtExpire,
  CORS_ORIGIN:           optional("CORS_ORIGIN", "http://localhost:3000,http://localhost:5173"),
  GOOGLE_CLIENT_ID:      optional("GOOGLE_CLIENT_ID", ""),
  GOOGLE_CLIENT_SECRET:  optional("GOOGLE_CLIENT_SECRET", ""),
  GOOGLE_REDIRECT_URI:   optional("GOOGLE_REDIRECT_URI", ""),
} as const;

export type Env = typeof env;