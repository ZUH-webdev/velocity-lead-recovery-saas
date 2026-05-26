import jwt from "jsonwebtoken";
import { env } from "../config/env";
import crypto from "crypto";

export type AuthTokens = { accessToken: string; refreshToken: string };
export interface AccessTokenPayload {
  sub: string;
  type: "access";
}
export interface RefreshTokenPayload {
  sub: string;
  type: "refresh";
  jti: string;
}




export function generateTokens(userId: string): AuthTokens {
  const jti = crypto.randomUUID();

  const accessToken = jwt.sign(
    { sub: userId, type: "access" } satisfies AccessTokenPayload,
    env.ACCESS_TOKEN_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRE },
  );

  const refreshToken = jwt.sign(
    { sub: userId, type: "refresh", jti } satisfies RefreshTokenPayload,
    env.REFRESH_TOKEN_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRE },
  );

  return { accessToken, refreshToken };
}

export function hashToken(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function refreshExpiresAt(): Date {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
}