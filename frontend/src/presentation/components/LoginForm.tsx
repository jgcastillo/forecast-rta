import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogIn, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../application/context/AuthContext';

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  // Document Title update for SEO and accessibility
  useEffect(() => {
    document.title = 'Login - Forecast RTA';
  }, []);

  const validateEmail = (val: string) => {
    if (!val) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return 'Invalid email format';
    return '';
  };

  const validatePassword = (val: string) => {
    if (!val) return 'Password is required';
    if (val.length < 8) return 'Password must be at least 8 characters';
    const hasLetter = /[a-zA-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    if (!hasLetter || !hasNumber) return 'Password must contain at least 1 letter and 1 number';
    return '';
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const errorMsg = field === 'email' ? validateEmail(email) : validatePassword(password);
    setErrors(prev => ({ ...prev, [field]: errorMsg }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    
    if (emailErr || passwordErr) {
      setErrors({ email: emailErr, password: passwordErr });
      setTouched({ email: true, password: true });
      return;
    }

    try {
      setErrors({});
      await login(email, password);
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Authentication failed. Please verify your credentials.';
      setErrors(prev => ({ ...prev, general: detail }));
    }
  };

  const isFormValid = !validateEmail(email) && !validatePassword(password);

  return (
    <div style={{ maxWidth: '450px', margin: '4rem auto', width: '100%' }}>
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <div className="brand-logo">
          <LogIn size={24} style={{ color: 'white' }} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>System Login</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Enter your credentials to access the Forecast RTA console.
          </p>
        </div>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div 
              style={{ 
                padding: '1rem', 
                borderRadius: 'var(--radius-md)', 
                background: 'rgba(239, 68, 68, 0.1)', 
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem'
              }}
            >
              <AlertTriangle size={18} style={{ color: 'var(--error)', flexShrink: 0 }} />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Email input field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">Email Address</label>
            <div className="input-container">
              <input
                id="email-input"
                type="email"
                className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) setErrors(prev => ({ ...prev, email: validateEmail(e.target.value) }));
                }}
                onBlur={() => handleBlur('email')}
                disabled={isLoading}
              />
              <Mail size={18} className="input-icon" />
            </div>
            {touched.email && errors.email && (
              <span className="error-message">
                <AlertTriangle size={14} />
                {errors.email}
              </span>
            )}
          </div>

          {/* Password input field */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="password-input">Password</label>
              <a 
                href="#forgot-password" 
                style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--accent-primary)', 
                  textDecoration: 'none', 
                  fontWeight: 600,
                  transition: 'color var(--transition-fast)'
                }}
              >
                Forgot Password?
              </a>
            </div>
            <div className="input-container">
              <input
                id="password-input"
                type="password"
                className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) setErrors(prev => ({ ...prev, password: validatePassword(e.target.value) }));
                }}
                onBlur={() => handleBlur('password')}
                disabled={isLoading}
              />
              <Lock size={18} className="input-icon" />
            </div>
            {touched.password && errors.password && (
              <span className="error-message">
                <AlertTriangle size={14} />
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={!isFormValid || isLoading}
            style={{ width: '100%' }}
          >
            {isLoading ? (
              <div className="spinner" />
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
