import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { HttpResponse } from "../utils/httpResponse";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      result.send(res);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      result.send(res);
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body as { refreshToken?: string };
      if (!refreshToken) {
        HttpResponse.badRequest("Refresh token required").send(res);
        return;
      }
      const result = await AuthService.refresh(refreshToken);
      result.send(res);
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body as { refreshToken?: string };
      if (!refreshToken) {
        HttpResponse.badRequest("Refresh token required").send(res);
        return;
      }
      const result = await AuthService.logout(refreshToken);
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