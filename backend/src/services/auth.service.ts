import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { HttpResponse } from "../utils/httpResponse";
import { z } from "zod";
import { env } from "../config/env";
import { sendVerificationEmail, sendWelcomeEmail } from "../utils/send-mail";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  generateTokens,
} from "../utils/auth";

// ── Validation schemas ─────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ── Helpers ────────────────────────────────────────────────────────────────

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AccessTokenPayload;
}

// ── AuthService ────────────────────────────────────────────────────────────

export class AuthService {
  // POST /auth/register
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
    const rawToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        password: passwordHash,
        emailVerified: false,
        emailVerificationToken: rawToken,
      },
    });

    const verifyLink = `${env.APP_URL}/verify?token=${rawToken}`;

    // Log the link so dev can use it without a real Resend key
    console.log(`\n🔗 [AUTH] Email verification link for ${email}:\n  ${verifyLink}\n`);

    await sendVerificationEmail(email, verifyLink);

    return HttpResponse.created(
      "Account created. Please check your email to verify your account.",
      { userId: user.id },
    );
  }

  // GET /auth/verify?token=xxx
  static async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return HttpResponse.badRequest("Invalid or expired verification token");
    }
    if (user.emailVerified) {
      return HttpResponse.badRequest("Email is already verified");
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null, // consume the token
      },
      select: { id: true, email: true, fullName: true },
    });

    // Issue tokens after email verification
    const { accessToken, refreshToken } = generateTokens(updatedUser.id);

    await prisma.user.update({
      where: { id: updatedUser.id },
      data: { refreshToken },
    });

    // Send welcome email (fire-and-forget)
    sendWelcomeEmail(
      updatedUser.email,
      updatedUser.fullName,
      `${env.APP_URL}/dashboard`,
    ).catch(() => undefined);

    return HttpResponse.ok("Email verified successfully", {
      user: updatedUser,
      accessToken,
      refreshToken,
    });
  }

  // POST /auth/login
  static async login(body: unknown) {
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return HttpResponse.unprocessable(
        "Validation failed",
        parsed.error.flatten(),
      );
    }

    const { email, password } = parsed.data;

    console.log("[AUTH] Login attempt for email:", email);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        password: true,
        emailVerified: true,
        lastLoginAt: true,
      },
    });

    const invalid = () => HttpResponse.unauthorized("Invalid email or password");

    if (!user || !user.password) return invalid();

    const match = await bcrypt.compare(password, user.password);
    if (!match) return invalid();

    if (!user.emailVerified) {
      return HttpResponse.forbidden(
        "Please verify your email before logging in",
      );
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken,
        lastLoginAt: new Date(),
      },
    });

    return HttpResponse.ok("Login successful", {
      user: { id: user.id, email: user.email, fullName: user.fullName },
      accessToken,
      refreshToken,
    });
  }

  // POST /auth/refresh  — body: { refreshToken } OR via httpOnly cookie
  static async refresh(token: string) {
    let payload: RefreshTokenPayload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      return HttpResponse.unauthorized("Invalid or expired refresh token");
    }

    // Validate the stored refresh token matches
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, refreshToken: true },
    });

    if (!user || user.refreshToken !== token) {
      return HttpResponse.unauthorized("Session expired or revoked");
    }

    const { accessToken, refreshToken } = generateTokens(payload.sub);

    await prisma.user.update({
      where: { id: payload.sub },
      data: { refreshToken },
    });

    return HttpResponse.ok("Token refreshed", { accessToken, refreshToken });
  }

  // POST /auth/logout  — body: { refreshToken }
  static async logout(token: string) {
    let payload: RefreshTokenPayload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      // Even if token is invalid, we clear it — logout should always succeed
      return HttpResponse.ok("Logged out successfully");
    }

    await prisma.user.updateMany({
      where: { id: payload.sub },
      data: { refreshToken: null },
    });

    return HttpResponse.ok("Logged out successfully");
  }

  // GET /auth/me  — requires valid access token
  static async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarURL: true,
        timezone: true,
        isPlatformAdmin: true,
        hasOnboarded: true,
        createdAt: true,
        lastLoginAt: true,
        tenantMembers: {
          where: { status: "ACTIVE" },
          select: {
            id: true,
            tenantId: true,
            status: true,
            jobTitle: true,
            department: true,
            role: { select: { id: true, key: true, name: true } },
            tenant: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!user) return HttpResponse.notFound("User not found");
    return HttpResponse.ok("User info retrieved", { user });
  }
}
