import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Chrome, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';
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

  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

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
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
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
              <img src="/velocity-logo.webp" alt="Velocity logo" className="h-12 w-12 object-contain" />
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
            <Link to="/forgot-password" className="neumorphism-forgot-link">
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

        {/* Divider */}
        <div className="neumorphism-divider">
          <div className="neumorphism-divider-line"></div>
          <span>or continue with</span>
          <div className="neumorphism-divider-line"></div>
        </div>

        {/* Social Login */}
        <div className="neumorphism-social-group">
          <button type="button" className="neumorphism-social" onClick={handleGoogleSignIn} disabled={loading}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="neumorphism-signup-link">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="neumorphism-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
