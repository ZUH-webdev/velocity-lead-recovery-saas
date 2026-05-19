import jwt from "jsonwebtoken";
import { HttpResponse } from "../utils/httpResponse";
import { env } from "../config/env";
import type { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    HttpResponse.unauthorized("Access token missing").send(res);
    return;
  }

  try {
    const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as {
      sub: string;
      type: string;
    };

    if (payload.type !== "access") {
      HttpResponse.unauthorized("Invalid token type").send(res);
      return;
    }

    req.userId = payload.sub;
    next();
  } catch {
    HttpResponse.unauthorized("Invalid or expired token").send(res);
  }
}