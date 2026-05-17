/**
 * AuthService: handles registration, login, access token creation, refresh, and logout.
 */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Redis = require('ioredis');
const env = require('../config/environment');

const redis = new Redis(process.env.REDIS_URL);
const REFRESH_TOKEN_KEY_PREFIX = 'refresh-token:';
const REFRESH_TOKEN_TTL_SECONDS = env.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60;

function sanitizeUser(user) {
  const userObject = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete userObject.password;
  return userObject;
}

function hashRefreshToken(refreshToken) {
  return crypto.createHash('sha256').update(refreshToken).digest('hex');
}

function generateAccessToken(user) {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
    fullName: user.fullName || '',
    role: user.role,
    businessId: user.businessId ? user.businessId.toString() : null,
  };

  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
}

async function persistRefreshToken(user, refreshToken) {
  const tokenHash = hashRefreshToken(refreshToken);
  const key = `${REFRESH_TOKEN_KEY_PREFIX}${tokenHash}`;

  await redis.set(
    key,
    JSON.stringify({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      businessId: user.businessId ? user.businessId.toString() : null,
    }),
    'EX',
    REFRESH_TOKEN_TTL_SECONDS,
  );

  return refreshToken;
}

/**
 * Sign up a new user
 * @param {{email:string,password:string,fullName?:string,businessId?:string}} input
 */
async function signup({ email, password, fullName, businessId }) {
  if (!email || !password) throw { status: 400, message: 'Email and password required' };
  if (password.length < 8) throw { status: 400, message: 'Password must be at least 8 characters' };

  const existing = await User.findOne({ email });
  if (existing) throw { status: 400, message: 'Email already registered' };

  const user = await User.create({ email, password, fullName, businessId });
  const accessToken = generateAccessToken(user);
  const refreshToken = await persistRefreshToken(user, generateRefreshToken());

  return { user: sanitizeUser(user), accessToken, refreshToken };
}

/**
 * Login existing user
 */
async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw { status: 401, message: 'Invalid credentials' };

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 401, message: 'Invalid credentials' };

  const accessToken = generateAccessToken(user);
  const refreshToken = await persistRefreshToken(user, generateRefreshToken());

  return { user: sanitizeUser(user), accessToken, refreshToken };
}

/**
 * Refresh access token using an opaque refresh token stored in Redis
 */
async function refreshToken({ refreshToken }) {
  try {
    if (!refreshToken) throw { status: 401, message: 'Invalid refresh token' };

    const tokenHash = hashRefreshToken(refreshToken);
    const key = `${REFRESH_TOKEN_KEY_PREFIX}${tokenHash}`;
    const stored = await redis.get(key);

    if (!stored) throw { status: 401, message: 'Invalid refresh token' };

    const session = JSON.parse(stored);
    const user = await User.findById(session.userId).select('+password');

    if (!user) throw { status: 401, message: 'Invalid refresh token' };

    await redis.del(key);

    const accessToken = generateAccessToken(user);
    const nextRefreshToken = await persistRefreshToken(user, generateRefreshToken());

    return { user: sanitizeUser(user), accessToken, refreshToken: nextRefreshToken };
  } catch (err) {
    throw { status: 401, message: 'Invalid refresh token' };
  }
}

/**
 * Logout: invalidate refresh token in Redis
 */
async function logout({ refreshToken }) {
  if (refreshToken) {
    const tokenHash = hashRefreshToken(refreshToken);
    const key = `${REFRESH_TOKEN_KEY_PREFIX}${tokenHash}`;
    await redis.del(key);
  }

  return true;
}

module.exports = { signup, login, refreshToken, logout, generateAccessToken };
