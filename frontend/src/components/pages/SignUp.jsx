"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/neumorphism.css';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const cardRef = useRef(null);

  const { signUp } = useAuth();
  const router = useRouter();

  // Ambient light shadow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      cardRef.current.style.boxShadow = `${x * 30}px ${y * 30}px 60px var(--neu-dark), ${-x * 30}px ${-y * 30}px 60px var(--neu-light)`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const validateForm = () => {
    if (!fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUp(email, password, fullName, { remember: true });
      router.replace('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neumorphism-container">
      <div className="neumorphism-card" ref={cardRef}>
        {/* Header */}
        <div className="neumorphism-header">
            <div className="neumorphism-icon">
              <Image src="/velocity-logo.webp" alt="Velocity logo" width={48} height={48} className="object-contain" />
            </div>
          <h2>Create Account</h2>
          <p>Join Velocity and start managing your leads</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="neumorphism-error-message show" style={{ margin: '0 0 28px 0', display: 'block', opacity: 1, transform: 'translateY(0)' }}>
            <div style={{ color: 'var(--neu-error)', fontSize: '14px', fontWeight: 500, display: 'flex', gap: '8px', alignItems: 'center' }}>
              <AlertCircle size={16} />
              {error}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignUp} style={{ marginBottom: '30px' }}>
          {/* Full Name */}
          <div className="neumorphism-input-group">
            <div className="neumorphism-input-wrapper">
              <div className="neumorphism-input-icon">
                <User size={20} />
              </div>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder=" "
                disabled={loading}
              />
              <label htmlFor="fullName">Full Name</label>
            </div>
          </div>

          {/* Email */}
          <div className="neumorphism-input-group">
            <div className="neumorphism-input-wrapper">
              <div className="neumorphism-input-icon">
                <Mail size={20} />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                disabled={loading}
                autoComplete="email"
              />
              <label htmlFor="email">Email address</label>
            </div>
          </div>

          {/* Password */}
          <div className="neumorphism-input-group">
            <div className="neumorphism-input-wrapper" style={{ paddingRight: '50px' }}>
              <div className="neumorphism-input-icon">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                disabled={loading}
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="neumorphism-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="neumorphism-input-group">
            <div className="neumorphism-input-wrapper" style={{ paddingRight: '50px' }}>
              <div className="neumorphism-input-icon">
                <Lock size={20} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" "
                disabled={loading}
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
              <button
                type="button"
                className="neumorphism-password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle confirm password visibility"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className={`neumorphism-button ${loading ? 'loading' : ''}`}
            style={{ marginTop: '30px' }}
          >
            <span className="neumorphism-button-text">Sign Up</span>
            <div className="neumorphism-button-loader">
              <div className="neumorphism-spinner"></div>
            </div>
          </button>
        </form>

        <div className="neumorphism-divider">
          <div className="neumorphism-divider-line"></div>
          <span>JWT account setup</span>
          <div className="neumorphism-divider-line"></div>
        </div>

        {/* Sign In Link */}
        <div className="neumorphism-signup-link">
          <p>
            Already have an account?{' '}
            <Link href="/signin" className="neumorphism-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
