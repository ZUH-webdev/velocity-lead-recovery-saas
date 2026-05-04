/**
 * Basic rate limiting middleware using express-rate-limit
 */
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests', code: 'RATE_LIMIT' });
  }
});

module.exports = limiter;
