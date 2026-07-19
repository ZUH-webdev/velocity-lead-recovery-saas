/**
 * Basic rate limiting middleware using express-rate-limit
 */
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests', code: 'RATE_LIMIT' });
  }
});

/**
 * Tighter limiter for brute-force-sensitive auth endpoints (login, register,
 * forgot-password). Layered on top of the global limiter, not a replacement.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many attempts. Please try again in 15 minutes.',
      code: 'RATE_LIMIT',
    });
  },
});
