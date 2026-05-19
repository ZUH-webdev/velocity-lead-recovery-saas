/**
 * Authentication routes
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const protectRoute = require('../middleware/protectRoute');

/**
 * POST /api/auth/register
 * body: { email, password, fullName, companyName, phone, industry }
 */
router.post('/register', authController.register);
router.post('/signup', authController.register);

/**
 * POST /api/auth/login
 */
router.post('/login', authController.login);

/**
 * POST /api/auth/logout
 */
router.post('/logout', authController.logout);

/**
 * POST /api/auth/refresh
 */
router.post('/refresh', authController.refresh);

/**
 * GET /api/auth/me - return the decoded access token payload
 */
router.get('/me', protectRoute, authController.me);
router.post('/verify', protectRoute, authController.me);

module.exports = router;
