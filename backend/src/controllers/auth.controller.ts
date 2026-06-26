import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { HttpResponse } from "../utils/httpResponse";

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
      const result = await AuthService.verifyEmail(token);
      if (result.data && (result.data as any).refreshToken) {
        res.cookie("refreshToken", (result.data as any).refreshToken, REFRESH_COOKIE_OPTIONS);
      }
      result.send(res);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      if (result.data && (result.data as any).refreshToken) {
        res.cookie("refreshToken", (result.data as any).refreshToken, REFRESH_COOKIE_OPTIONS);
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
      const result = await AuthService.refresh(refreshToken);
      if (result.data && (result.data as any).refreshToken) {
        res.cookie("refreshToken", (result.data as any).refreshToken, REFRESH_COOKIE_OPTIONS);
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

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.me(req.userId!);
      result.send(res);
    } catch (err) {
      next(err);
    }
  }
}
