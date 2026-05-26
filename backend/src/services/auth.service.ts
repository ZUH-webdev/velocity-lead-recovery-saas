import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { HttpResponse } from "../utils/httpResponse";
import { z } from "zod";
import { env } from "../config/env";
import { sendVerificationEmail } from "../utils/send-mail";
import {
  hashToken,
  AccessTokenPayload,
  RefreshTokenPayload,
  generateTokens,
  refreshExpiresAt,
} from "../utils/auth";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function createSession(
  userId: string,
  refreshToken: string,
): Promise<void> {
  const { jti } = jwt.decode(refreshToken) as RefreshTokenPayload;
  await prisma.authSession.create({
    data: {
      userId,
      sessionTokenHash: hashToken(jti),
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
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { email, fullName },
      });

      await tx.authAccount.create({
        data: {
          userId: newUser.id,
          provider: "credentials",
          providerAccountId: newUser.id,
          profile: { passwordHash },
        },
      });

      await tx.authVerificationToken.create({
        data: {
          email,
          tokenHash: hashToken(verificationToken),
          purpose: "EMAIL_VERIFICATION",
          expiresAt: verificationExpiry,
        },
      });
    });

    await sendVerificationEmail(
      email,
      `${env.APP_URL}/auth/verify?token=${verificationToken}`,
    );

    // ← No tokens issued here. User must verify email first.
    return HttpResponse.created(
      "Account created. Please check your email to verify your account.",
    );
  }

  static async verifyEmail(token: string) {
    const tokenHash = hashToken(token);

    const record = await prisma.authVerificationToken.findFirst({
      where: { tokenHash, purpose: "EMAIL_VERIFICATION" },
    });

    if (!record || record.purpose !== "EMAIL_VERIFICATION") {
      return HttpResponse.badRequest("Invalid verification token");
    }
    if (record.consumedAt) {
      return HttpResponse.badRequest("Token has already been used");
    }
    if (record.expiresAt < new Date()) {
      return HttpResponse.badRequest("Verification token has expired");
    }

    const user = await prisma.$transaction(async (tx) => {
      await tx.authVerificationToken.update({
        where: { tokenHash, purpose: "EMAIL_VERIFICATION" },
        data: { consumedAt: new Date() },
      });

      return tx.user.update({
        where: { email: record.email },
        data: { emailVerifiedAt: new Date() },
        select: { id: true, email: true, fullName: true },
      });
    });

    // ← Tokens issued here, after email is confirmed.
    const { accessToken, refreshToken } = generateTokens(user.id);
    await createSession(user.id, refreshToken);

    return HttpResponse.ok("Email verified successfully", {
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
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            emailVerifiedAt: true,
          },
        },
      },
    });

    const invalid = () =>
      HttpResponse.unauthorized("Invalid email or password");

    if (!account?.profile || typeof account.profile !== "object")
      return invalid();
    const { passwordHash } = account.profile as { passwordHash?: string };
    if (!passwordHash) return invalid();

    const match = await bcrypt.compare(password, passwordHash);
    if (!match) return invalid();

    if (!account.user.emailVerifiedAt) {
      return HttpResponse.forbidden(
        "Please verify your email before logging in",
      );
    }

    await prisma.user.update({
      where: { id: account.user.id },
      data: { lastLoginAt: new Date() },
    });

    const { id, email: userEmail, fullName } = account.user;
    const { accessToken, refreshToken } = generateTokens(id);
    await createSession(id, refreshToken);

    return HttpResponse.ok("Login successful", {
      user: { id, email: userEmail, fullName },
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
      where: { sessionTokenHash: hashToken(payload.jti) },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      return HttpResponse.unauthorized("Session expired or revoked");
    }

    await prisma.authSession.update({
      where: { sessionTokenHash: hashToken(payload.jti) },
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
      where: { sessionTokenHash: hashToken(payload.jti) },
      data: { revokedAt: new Date() },
    });

    return HttpResponse.ok("Logged out successfully");
  }

  static async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) return HttpResponse.notFound("User not found");
    return HttpResponse.ok("User info retrieved", { user });
  }
}
