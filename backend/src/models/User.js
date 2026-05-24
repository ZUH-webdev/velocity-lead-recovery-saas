/**
 * User model
 * - email (unique)
 * - password (hashed)
 * - businessId (ObjectId)
 * - role, subscriptionTier
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmailValid } = require('../utils/validators');

const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', index: true },
    role: { type: String, enum: ['admin', 'manager', 'agent'], default: 'admin' },
    subscriptionTier: { type: String, enum: ['free', 'starter', 'pro'], default: 'free' },
    emailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, select: false },
    emailVerificationExpiresAt: { type: Date, select: false }
  },
  { timestamps: true }
);

// Email validation
UserSchema.path('email').validate(function (email) {
  return isEmailValid(email);
}, 'Invalid email format');

// Pre-save hook to hash password if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);
