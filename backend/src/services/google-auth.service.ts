import type { Profile } from "passport-google-oauth20";
import { prisma } from "../config/prisma";

const PROVIDER = "google";

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
}
