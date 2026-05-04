/**
 * JWT verification middleware
 */
const jwt = require('jsonwebtoken');
const env = require('../config/environment');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header', code: 'UNAUTHORIZED' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    // Attach user context
    req.user = { id: decoded.userId, businessId: decoded.businessId };
    // Optionally load user from DB
    req.currentUser = await User.findById(decoded.userId).select('-password');
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' });
  }
}

module.exports = authMiddleware;
