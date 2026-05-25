import type { Request, Response, NextFunction } from "express";

interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
}

interface ErrorPayload {
  error: string;
  code: string;
  details?: Record<string, unknown>;
}

export function errorHandler(
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(err);

  const status = err.status ?? 500;

  const payload: ErrorPayload = {
    error: err.message || "Internal Server Error",
    code: err.code ?? (status === 500 ? "INTERNAL_ERROR" : "ERROR"),
  };

  if (err.details !== undefined) payload.details = err.details;

  res.status(status).json(payload);
}