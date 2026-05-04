/**
 * Authentication routes
 */
const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');
const authMiddleware = require('../middleware/auth.middleware');
const { isEmailValid } = require('../utils/validators');

/**
 * POST /api/auth/signup
 * body: { email, password, businessName }
 */
router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, businessName } = req.body;
    if (!email || !password || !businessName) return res.status(400).json({ error: 'Missing required fields', code: 'BAD_REQUEST' });
    if (!isEmailValid(email)) return res.status(400).json({ error: 'Invalid email', code: 'INVALID_EMAIL' });

    // business creation could be separate; for now signup stores businessId if provided
    const result = await AuthService.signup({ email, password });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password', code: 'BAD_REQUEST' });
    const result = await AuthService.login({ email, password });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', authMiddleware, async (req, res, next) => {
  try {
    await AuthService.logout({ userId: req.user.id });
    res.json({ success: true, data: { message: 'Logged out' } });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/refresh
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Missing refresh token', code: 'BAD_REQUEST' });
    const result = await AuthService.refreshToken({ refreshToken });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/verify - verify provided access token
 */
router.post('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token', code: 'UNAUTHORIZED' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = require('jsonwebtoken').verify(token, require('../config/environment').JWT_SECRET);
    res.json({ success: true, data: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
  }
});

module.exports = router;
