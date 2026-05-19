import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { HttpResponse } from "../utils/httpResponse";
import { z } from "zod";
import { env } from "../config/env";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type AuthTokens = { accessToken: string; refreshToken: string };

interface AccessTokenPayload {
  sub: string;
  type: "access";
}
interface RefreshTokenPayload {
  sub: string;
  type: "refresh";
  jti: string;
}

function generateTokens(userId: string): AuthTokens {
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

function hashJti(jti: string): string {
  return crypto.createHash("sha256").update(jti).digest("hex");
}

function refreshExpiresAt(): Date {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
}

async function createSession(
  userId: string,
  refreshToken: string,
): Promise<void> {
  const { jti } = jwt.decode(refreshToken) as RefreshTokenPayload;

  await prisma.authSession.create({
    data: {
      userId,
      sessionTokenHash: hashJti(jti),
      expiresAt: refreshExpiresAt(),
    },
  });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AccessTokenPayload;
}

// ── Service ───────────────────────────────────────────────────────────────────

export class AuthService {
  static async register(body: unknown) {
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return HttpResponse.unprocessable(
        "Validation failed",
        parsed.error.flatten(),
      );
    }

    const { email, password, fullName } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return HttpResponse.conflict("Email already in use");

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { email, fullName },
        select: { id: true, email: true, fullName: true, createdAt: true },
      });

      await tx.authAccount.create({
        data: {
          userId: newUser.id,
          provider: "credentials",
          providerAccountId: newUser.id,
          profile: { passwordHash },
        },
      });

      return newUser;
    });

    const { accessToken, refreshToken } = generateTokens(user.id);
    await createSession(user.id, refreshToken);

    return HttpResponse.created("Account created", {
      user,
      accessToken,
      refreshToken,
    });
  }

  static async login(body: unknown) {
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return HttpResponse.unprocessable(
        "Validation failed",
        parsed.error.flatten(),
      );
    }

    const { email, password } = parsed.data;

    const account = await prisma.authAccount.findFirst({
      where: { user: { email }, provider: "credentials" },
      include: { user: { select: { id: true, email: true, fullName: true } } },
    });

    const invalid = () =>
      HttpResponse.unauthorized("Invalid email or password");

    if (!account?.profile || typeof account.profile !== "object")
      return invalid();
    const { passwordHash } = account.profile as { passwordHash?: string };
    if (!passwordHash) return invalid();

    const match = await bcrypt.compare(password, passwordHash);
    if (!match) return invalid();

    await prisma.user.update({
      where: { id: account.user.id },
      data: { lastLoginAt: new Date() },
    });

    const { accessToken, refreshToken } = generateTokens(account.user.id);
    await createSession(account.user.id, refreshToken);

    return HttpResponse.ok("Login successful", {
      user: account.user,
      accessToken,
      refreshToken,
    });
  }

  static async refresh(token: string) {
    let payload: RefreshTokenPayload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      return HttpResponse.unauthorized("Invalid or expired refresh token");
    }

    const session = await prisma.authSession.findUnique({
      where: { sessionTokenHash: hashJti(payload.jti) },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      return HttpResponse.unauthorized("Session expired or revoked");
    }

    // Rotate: revoke old session, issue new token pair
    await prisma.authSession.update({
      where: { sessionTokenHash: hashJti(payload.jti) },
      data: { revokedAt: new Date() },
    });

    const { accessToken, refreshToken } = generateTokens(payload.sub);
    await createSession(payload.sub, refreshToken);

    return HttpResponse.ok("Token refreshed", { accessToken, refreshToken });
  }

  static async logout(token: string) {
    let payload: RefreshTokenPayload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      return HttpResponse.unauthorized("Invalid refresh token");
    }

    await prisma.authSession.updateMany({
      where: { sessionTokenHash: hashJti(payload.jti) },
      data: { revokedAt: new Date() },
    });

    return HttpResponse.ok("Logged out successfully");
  }

  static async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, createdAt: true, lastLoginAt: true },
    });

    if (!user) return HttpResponse.notFound("User not found");
    return HttpResponse.ok("User info retrieved", { user });
  }
}
