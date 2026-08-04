import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { HttpResponse } from "../utils/httpResponse";
import { z } from "zod";
import { env } from "../config/env";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "../utils/send-mail";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  generateTokens,
  hashToken,
} from "../utils/auth";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const PASSWORD_RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h

// ── Validation schemas ─────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters")
    .regex(/[0-9]/, "Password must contain at least one number"),
  fullName: z.string().min(2),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const ResendVerificationSchema = z.object({
  email: z.string().email(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password cannot exceed 72 characters")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).max(120).optional(),
  avatarURL: z
    .string()
    .max(5_000_000, "Image is too large")
    .refine(
      (val) => /^data:image\/(png|jpe?g|webp|gif);base64,/.test(val) || /^https?:\/\//.test(val),
      "Avatar must be an image data URL or a valid URL",
    )
    .nullable()
    .optional(),
});

// ── Helpers ────────────────────────────────────────────────────────────────

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AccessTokenPayload;
}

// Wrapper for endpoints that issue a refresh token: the token is handed back
// out-of-band so the controller can set it as an httpOnly cookie without it
// ever being serialized into the JSON response body.
interface AuthResult<T> {
  result: HttpResponse<T>;
  refreshToken?: string;
}

// ── AuthService ────────────────────────────────────────────────────────────

export class AuthService {
  // POST /auth/register
  static async register(body: unknown) {
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return HttpResponse.unprocessable(
        "Please check your details and try again.",
        parsed.error.flatten(),
      );
    }

    const { email, password, fullName } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return HttpResponse.conflict("An account with this email already exists.");

    const passwordHash = await bcrypt.hash(password, 12);
    const rawToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationTokenExpiresAt = new Date(
      Date.now() + VERIFICATION_TOKEN_TTL_MS,
    );

    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        password: passwordHash,
        emailVerified: false,
        emailVerificationToken: rawToken,
        emailVerificationTokenExpiresAt,
      },
    });

    const verifyLink = `${env.APP_URL}/verify?token=${rawToken}`;

    // Log the link in dev only so it never ends up in prod logs
    if (env.NODE_ENV !== "production") {
      console.log(`\n🔗 [AUTH] Email verification link for ${email}:\n  ${verifyLink}\n`);
    }

    await sendVerificationEmail(email, verifyLink);

    return HttpResponse.created(
      "Account created. Please check your email to verify your account.",
      { userId: user.id },
    );
  }

  // POST /auth/verify?token=xxx
  static async verifyEmail(token: string): Promise<AuthResult<unknown>> {
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return {
        result: HttpResponse.badRequest("This link has already been used. Please sign in to your account."),
      };
    }
    if (user.emailVerified) {
      return {
        result: HttpResponse.badRequest("This link has already been used. Please sign in to your account."),
      };
    }
    if (
      !user.emailVerificationTokenExpiresAt ||
      user.emailVerificationTokenExpiresAt < new Date()
    ) {
      return {
        result: HttpResponse.badRequest(
          "This verification link has expired. Click \"Resend verification email\" to get a new one.",
        ),
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null, // consume the token
        emailVerificationTokenExpiresAt: null,
      },
      select: { id: true, email: true, fullName: true, emailVerified: true },
    });

    // Issue tokens after email verification
    const { accessToken, refreshToken } = generateTokens(updatedUser.id);

    await prisma.user.update({
      where: { id: updatedUser.id },
      data: { refreshToken: hashToken(refreshToken) },
    });

    // Send welcome email (fire-and-forget)
    sendWelcomeEmail(
      updatedUser.email,
      updatedUser.fullName,
      `${env.APP_URL}/dashboard`,
    ).catch(() => undefined);

    return {
      result: HttpResponse.ok("Email verified successfully", {
        user: updatedUser,
        accessToken,
      }),
      refreshToken,
    };
  }

  // POST /auth/resend-verification
  static async resendVerification(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    // Silent no-op if user doesn't exist or is already verified — avoids user enumeration
    if (!user || user.emailVerified) {
      return HttpResponse.ok(
        "If this email exists and is unverified, a new link has been sent.",
      );
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationTokenExpiresAt = new Date(
      Date.now() + VERIFICATION_TOKEN_TTL_MS,
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: rawToken,
        emailVerificationTokenExpiresAt,
      },
    });

    const verifyLink = `${env.APP_URL}/verify?token=${rawToken}`;

    if (env.NODE_ENV !== "production") {
      console.log(`\n🔗 [AUTH] Resent verification link for ${email}:\n  ${verifyLink}\n`);
    }

    await sendVerificationEmail(email, verifyLink);

    return HttpResponse.ok(
      "If this email exists and is unverified, a new link has been sent.",
    );
  }

  // POST /auth/login
  static async login(body: unknown): Promise<AuthResult<unknown>> {
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return {
        result: HttpResponse.unprocessable(
          "Validation failed",
          parsed.error.flatten(),
        ),
      };
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarURL: true,
        password: true,
        emailVerified: true,
        lastLoginAt: true,
      },
    });

    const invalid = () => ({
      result: HttpResponse.unauthorized("Invalid email or password."),
    });

    if (!user || !user.password) return invalid();

    const match = await bcrypt.compare(password, user.password);
    if (!match) return invalid();

    if (!user.emailVerified) {
      return {
        result: HttpResponse.forbidden(
          "Please verify your email before signing in.",
        ),
      };
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: hashToken(refreshToken),
        lastLoginAt: new Date(),
      },
    });

    // Determine workspace membership directly from TenantMember rather than
    // the (unmaintained) User.hasOnboarded flag, so this stays correct even
    // for users who already have a tenant.
    const tenantMembers = await prisma.tenantMember.findMany({
      where: { userId: user.id, status: "ACTIVE" },
      select: { tenantId: true },
    });

    return {
      result: HttpResponse.ok("Login successful", {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatarURL: user.avatarURL,
          emailVerified: user.emailVerified,
          hasWorkspace: tenantMembers.length > 0,
          tenantMembers,
        },
        accessToken,
      }),
      refreshToken,
    };
  }

  // POST /auth/refresh  — body: { refreshToken } OR via httpOnly cookie
  static async refresh(token: string): Promise<AuthResult<unknown>> {
    let payload: RefreshTokenPayload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      return { result: HttpResponse.unauthorized("Invalid or expired refresh token") };
    }

    // Validate the stored (hashed) refresh token matches
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, refreshToken: true },
    });

    if (!user || user.refreshToken !== hashToken(token)) {
      return { result: HttpResponse.unauthorized("Session expired or revoked") };
    }

    const { accessToken, refreshToken } = generateTokens(payload.sub);

    await prisma.user.update({
      where: { id: payload.sub },
      data: { refreshToken: hashToken(refreshToken) },
    });

    return {
      result: HttpResponse.ok("Token refreshed", { accessToken }),
      refreshToken,
    };
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
      where: { id: payload.sub, refreshToken: hashToken(token) },
      data: { refreshToken: null },
    });

    return HttpResponse.ok("Logged out successfully");
  }

  // POST /auth/forgot-password
  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    // Silent no-op if user doesn't exist or hasn't verified their email — avoids user enumeration
    if (!user || !user.emailVerified) {
      return HttpResponse.ok(
        "If this email exists, a password reset link has been sent.",
      );
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const passwordResetTokenExpiresAt = new Date(
      Date.now() + PASSWORD_RESET_TOKEN_TTL_MS,
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: rawToken,
        passwordResetTokenExpiresAt,
      },
    });

    const resetLink = `${env.APP_URL}/reset-password?token=${rawToken}`;

    if (env.NODE_ENV !== "production") {
      console.log(`\n🔑 [AUTH] Password reset link for ${email}:\n  ${resetLink}\n`);
    }

    await sendPasswordResetEmail(email, resetLink);

    return HttpResponse.ok(
      "If this email exists, a reset link has been sent.",
    );
  }

  // POST /auth/reset-password
  static async resetPassword(body: unknown) {
    const parsed = ResetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return HttpResponse.unprocessable(
        "Validation failed",
        parsed.error.flatten(),
      );
    }

    const { token, password } = parsed.data;

    const user = await prisma.user.findFirst({
      where: { passwordResetToken: token },
    });

    if (!user) {
      return HttpResponse.badRequest("This reset link is invalid.");
    }

    if (
      !user.passwordResetTokenExpiresAt ||
      user.passwordResetTokenExpiresAt < new Date()
    ) {
      return HttpResponse.badRequest("This reset link has expired.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null,
        refreshToken: null, // invalidate all existing sessions
      },
    });

    return HttpResponse.ok("Password reset successfully");
  }

  // Issues a session for a user resolved via Google OAuth (no password check —
  // the strategy already verified their Google identity).
  static async issueOAuthSession(userId: string) {
    const { accessToken, refreshToken } = generateTokens(userId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: hashToken(refreshToken),
        lastLoginAt: new Date(),
      },
    });

    const tenantMembers = await prisma.tenantMember.findMany({
      where: { userId, status: "ACTIVE" },
      select: { tenantId: true },
    });

    return { accessToken, refreshToken, hasWorkspace: tenantMembers.length > 0 };
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
    return HttpResponse.ok("User info retrieved", {
      user: { ...user, hasWorkspace: user.tenantMembers.length > 0 },
    });
  }

  // PATCH /auth/me — requires valid access token
  static async updateProfile(userId: string, body: unknown) {
    const parsed = UpdateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return HttpResponse.unprocessable(
        "Please check your details and try again.",
        parsed.error.flatten(),
      );
    }

    const { fullName, avatarURL } = parsed.data;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName !== undefined ? { fullName } : {}),
        ...(avatarURL !== undefined ? { avatarURL } : {}),
      },
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
      },
    });

    return HttpResponse.ok("Profile updated", { user });
  }
}
