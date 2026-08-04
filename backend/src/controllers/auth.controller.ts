import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { HttpResponse } from "../utils/httpResponse";
import { env } from "../config/env";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      result.send(res);
    } catch (err) {
      next(err);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.query as { token?: string };

      if (!token) {
        HttpResponse.badRequest("Verification token required").send(res);
        return;
      }
      const { result, refreshToken } = await AuthService.verifyEmail(token);
      if (refreshToken) {
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
      }
      result.send(res);
    } catch (err) {
      next(err);
    }
  }

  static async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body as { email?: string };
      if (!email) {
        HttpResponse.badRequest("Email is required").send(res);
        return;
      }
      const result = await AuthService.resendVerification(email);
      result.send(res);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { result, refreshToken } = await AuthService.login(req.body);
      if (refreshToken) {
        res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
      }
      result.send(res);
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
      if (!refreshToken) {
        HttpResponse.badRequest("Refresh token required").send(res);
        return;
      }
      const { result, refreshToken: newRefreshToken } = await AuthService.refresh(refreshToken);
      if (newRefreshToken) {
        res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
      }
      result.send(res);
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
      if (!refreshToken) {
        HttpResponse.badRequest("Refresh token required").send(res);
        return;
      }
      const result = await AuthService.logout(refreshToken);
      res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
      result.send(res);
    } catch (err) {
      next(err);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body as { email?: string };
      if (!email) {
        HttpResponse.badRequest("Email is required").send(res);
        return;
      }
      const result = await AuthService.forgotPassword(email);
      result.send(res);
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.resetPassword(req.body);
      result.send(res);
    } catch (err) {
      next(err);
    }
  }

  static async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as { id: string } | undefined;
      if (!user) {
        res.redirect(`${env.APP_URL}/sign-in?error=google_failed`);
        return;
      }

      const { accessToken, refreshToken, hasWorkspace } = await AuthService.issueOAuthSession(
        user.id,
      );
      res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

      const status = hasWorkspace ? "dashboard" : "onboarding";
      res.redirect(
        `${env.APP_URL}/auth/callback?token=${encodeURIComponent(accessToken)}&status=${status}`,
      );
    } catch (err) {
      next(err);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.me(req.userId!);
      result.send(res);
    } catch (err) {
      next(err);
    }
  }
}
