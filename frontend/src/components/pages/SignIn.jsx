"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/neumorphism.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const cardRef = useRef(null);

  const { signIn } = useAuth();
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

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password, { remember: rememberMe });
      router.replace('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
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
          <h2>Welcome Back</h2>
          <p>Sign in to your Velocity account</p>
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
        <form onSubmit={handleSignIn} style={{ marginBottom: '30px' }}>
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
            <div className="neumorphism-input-wrapper">
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
                autoComplete="current-password"
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

          {/* Remember & Forgot */}
          <div className="neumorphism-form-options">
            <div className="neumorphism-checkbox-wrapper">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="remember" className="neumorphism-checkbox-label">
                <div className="neumorphism-checkbox">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                Remember me
              </label>
            </div>
            <Link href="/forgot-password" className="neumorphism-forgot-link">
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className={`neumorphism-button ${loading ? 'loading' : ''}`}
            style={{ marginTop: '30px' }}
          >
            <span className="neumorphism-button-text">Sign In</span>
            <div className="neumorphism-button-loader">
              <div className="neumorphism-spinner"></div>
            </div>
          </button>
        </form>

        <div className="neumorphism-divider">
          <div className="neumorphism-divider-line"></div>
          <span>Secure JWT access</span>
          <div className="neumorphism-divider-line"></div>
        </div>

        {/* Sign Up Link */}
        <div className="neumorphism-signup-link">
          <p>
            Don't have an account?{' '}
            <Link href="/signup" className="neumorphism-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
