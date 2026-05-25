const AuthService = require('../services/AuthService');
const Business = require('../models/Business');
const env = require('../config/environment');

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/auth',
  maxAge: env.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60 * 1000,
};

function getCookieValue(cookieHeader, name) {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [rawName, ...rawValue] = cookie.trim().split('=');
    if (decodeURIComponent(rawName) === name) {
      return decodeURIComponent(rawValue.join('='));
    }
  }

  return null;
}

function setRefreshCookie(res, refreshToken) {
  res.cookie('refreshToken', refreshToken, refreshCookieOptions);
}

function clearRefreshCookie(res) {
  res.clearCookie('refreshToken', refreshCookieOptions);
}

async function register(req, res, next) {
  try {
    const tenantPayload = req.body.tenant || req.body.workspace || {};
    const companyName = req.body.companyName || tenantPayload.name || tenantPayload.companyName;
    const phone = req.body.phone || tenantPayload.phone || '';
    const industry = req.body.industry || tenantPayload.industry || '';
    const { email, password, fullName } = req.body;

    if (!companyName) {
      throw { status: 400, message: 'Company name is required' };
    }

    const business = await Business.create({
      name: companyName,
      phone,
      industry,
    });

    let result;

    try {
      result = await AuthService.signup({
        email,
        password,
        fullName,
        businessId: business._id,
      });
    } catch (signupError) {
      await Business.findByIdAndDelete(business._id).catch(() => {});
      throw signupError;
    }

    const frontendBaseUrl = (env.CORS_ORIGIN || 'http://localhost:3000').split(',')[0].trim();
    const verificationLink = `${frontendBaseUrl}/verify?token=${encodeURIComponent(result.verificationToken)}`;

    return res.status(201).json({
      success: true,
      data: {
        user: result.user,
        verificationRequired: true,
        verificationToken: result.verificationToken,
        verificationLink,
        message: 'Check your email to verify your account',
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const token = req.body.token || req.query.token;
    const result = await AuthService.verifyEmail({ token });

    setRefreshCookie(res, result.refreshToken);

    return res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });

    setRefreshCookie(res, result.refreshToken);

    return res.json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const refreshToken = req.body.refreshToken || getCookieValue(req.headers.cookie, 'refreshToken');
    const result = await AuthService.refreshToken({ refreshToken });

    setRefreshCookie(res, result.refreshToken);

    return res.json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    const refreshToken = req.body.refreshToken || getCookieValue(req.headers.cookie, 'refreshToken');
    await AuthService.logout({ refreshToken });

    clearRefreshCookie(res);

    return res.json({
      success: true,
      data: { message: 'Logged out' },
    });
  } catch (error) {
    return next(error);
  }
}

function me(req, res) {
  return res.json({
    success: true,
    data: { user: req.user },
  });
}

module.exports = { register, verifyEmail, login, refresh, logout, me };