/**
 * AuthService: handles signup, login, token generation, refresh
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Redis = require('ioredis');
const env = require('../config/environment');

const redis = new Redis(process.env.REDIS_URL);

/**
 * Generate JWT access token
 * @param {Object} payload
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRE });
}

/**
 * Generate refresh token (stored in Redis)
 * @param {string} userId
 */
async function generateRefreshToken(userId) {
  const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: `${env.REFRESH_TOKEN_EXPIRE_DAYS}d` });
  const key = `refresh:${userId}`;
  await redis.set(key, token, 'EX', env.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60);
  return token;
}

/**
 * Sign up a new user
 * @param {{email:string,password:string,businessId?:string}} input
 */
async function signup({ email, password, businessId }) {
  if (!email || !password) throw { status: 400, message: 'Email and password required' };
  if (password.length < 6) throw { status: 400, message: 'Password must be at least 6 characters' };

  const existing = await User.findOne({ email });
  if (existing) throw { status: 400, message: 'Email already registered' };

  const user = new User({ email, password, businessId });
  await user.save();

  const payload = { userId: user._id.toString(), businessId: user.businessId };
  const token = generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(user._id.toString());

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token, refreshToken };
}

/**
 * Login existing user
 */
async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw { status: 401, message: 'Invalid credentials' };

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 401, message: 'Invalid credentials' };

  const payload = { userId: user._id.toString(), businessId: user.businessId };
  const token = generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(user._id.toString());

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token, refreshToken };
}

/**
 * Refresh access token using refresh token stored in Redis
 */
async function refreshToken({ refreshToken }) {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_SECRET);
    const key = `refresh:${decoded.userId}`;
    const stored = await redis.get(key);
    if (!stored || stored !== refreshToken) throw { status: 401, message: 'Invalid refresh token' };

    const payload = { userId: decoded.userId };
    const accessToken = generateAccessToken(payload);
    return { token: accessToken };
  } catch (err) {
    throw { status: 401, message: 'Invalid refresh token' };
  }
}

/**
 * Logout: invalidate refresh token in Redis
 */
async function logout({ userId }) {
  const key = `refresh:${userId}`;
  await redis.del(key);
  return true;
}

module.exports = { signup, login, refreshToken, logout, generateAccessToken };
