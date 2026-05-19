import type { Response } from "express";

export class HttpResponse<T = undefined> {
  readonly statusCode: number;
  readonly message: string;
  readonly data?: T;

  private constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    if(data !== undefined) this.data = data;
  }

  send(res: Response): void {
    const body: { success: boolean; message: string; data?: T } = {
      success: this.statusCode < 400,
      message: this.message,
    };
    if (this.data !== undefined) body.data = this.data;
    res.status(this.statusCode).json(body);
  }

  // ── 2xx ────────────────────────────────────────────────────────────────────

  static ok<T>(message: string, data?: T) {
    return new HttpResponse<T>(200, message, data);
  }

  static created<T>(message: string, data?: T) {
    return new HttpResponse<T>(201, message, data);
  }

  static noContent() {
    return new HttpResponse<undefined>(204, "No Content");
  }

  // ── 4xx ────────────────────────────────────────────────────────────────────

  static badRequest<T>(message: string, data?: T) {
    return new HttpResponse<T>(400, message, data);
  }

  static unauthorized(message = "Unauthorized") {
    return new HttpResponse<undefined>(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new HttpResponse<undefined>(403, message);
  }

  static notFound(message = "Not Found") {
    return new HttpResponse<undefined>(404, message);
  }

  static conflict<T>(message: string, data?: T) {
    return new HttpResponse<T>(409, message, data);
  }

  static unprocessable<T>(message: string, data?: T) {
    return new HttpResponse<T>(422, message, data);
  }

  // ── 5xx ────────────────────────────────────────────────────────────────────

  static internalError(message = "Internal Server Error") {
    return new HttpResponse<undefined>(500, message);
  }

  static error<T>(message: string, data?: T) {
    return new HttpResponse<T>(500, message, data);
  }
}