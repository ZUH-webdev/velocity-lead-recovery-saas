import type { Profile } from "passport-google-oauth20";
import { prisma } from "../config/prisma";
import { encryptSecret } from "../utils/crypto";

const PROVIDER = "google";

interface CalendarTokens {
  accessToken: string;
  refreshToken: string;
  scope?: string | undefined;
  tokenType?: string | undefined;
  expiresInSeconds?: number | undefined;
  providerAccountId: string;
  providerEmail?: string | undefined;
}

export class GoogleAuthService {
  // Finds the user tied to this Google account, linking or creating one as needed.
  static async findOrCreateUser(profile: Profile) {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new Error("Google account has no email");
    }

    const googleId = profile.id;
    const avatarUrl = profile.photos?.[0]?.value ?? null;
    const fullName = profile.displayName?.trim() || "Google User";

    const existingAccount = await prisma.authAccount.findUnique({
      where: { provider_providerAccountId: { provider: PROVIDER, providerAccountId: googleId } },
      include: { user: true },
    });
    if (existingAccount) return existingAccount.user;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      await prisma.authAccount.create({
        data: {
          userId: existingUser.id,
          provider: PROVIDER,
          providerAccountId: googleId,
          providerEmail: email,
        },
      });

      if (!existingUser.emailVerified || !existingUser.avatarURL) {
        return prisma.user.update({
          where: { id: existingUser.id },
          data: {
            emailVerified: true,
            emailVerifiedAt: existingUser.emailVerifiedAt ?? new Date(),
            avatarURL: existingUser.avatarURL ?? avatarUrl,
          },
        });
      }
      return existingUser;
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        fullName,
        password: null,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        avatarURL: avatarUrl,
      },
    });

    await prisma.authAccount.create({
      data: {
        userId: newUser.id,
        provider: PROVIDER,
        providerAccountId: googleId,
        providerEmail: email,
      },
    });

    return newUser;
  }

  // Persists calendar OAuth tokens (encrypted at rest) onto the given user's
  // Google AuthAccount, creating one if the user has never linked Google before
  // (e.g. they signed up with email/password and are connecting calendar now).
  static async linkCalendarTokens(userId: string, tokens: CalendarTokens) {
    const expiresAt = tokens.expiresInSeconds
      ? new Date(Date.now() + tokens.expiresInSeconds * 1000)
      : null;

    const data = {
      accessToken: encryptSecret(tokens.accessToken),
      refreshToken: encryptSecret(tokens.refreshToken),
      scope: tokens.scope ?? null,
      tokenType: tokens.tokenType ?? null,
      expiresAt,
      providerAccountId: tokens.providerAccountId,
      providerEmail: tokens.providerEmail ?? null,
    };

    await prisma.authAccount.upsert({
      where: { userId_provider: { userId, provider: PROVIDER } },
      update: data,
      create: { userId, provider: PROVIDER, ...data },
    });
  }
}
