import React, { useState, FormEvent, useEffect } from 'react';
import { Lock, CheckCircle2, AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { authApi } from '../../infrastructure/api/client';
import { useToast } from '../../application/context/ToastContext';
import { useAuth } from '../../application/context/AuthContext';
import axios from 'axios';

export const ResetPasswordView: React.FC = () => {
  const { addToast } = useToast();
  const { logout } = useAuth();
  const [token, setToken] = useState<string>('');
  
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; global?: string }>({});
  const [touched, setTouched] = useState<{ password?: boolean; confirmPassword?: boolean }>({});

  // Parse token from window location hash on mount/hashchange
  useEffect(() => {
    const parseToken = () => {
      const hash = window.location.hash;
      const queryString = hash.split('?')[1] || '';
      const params = new URLSearchParams(queryString);
      const tokenVal = params.get('token') || '';
      setToken(tokenVal);
    };

    parseToken();
    window.addEventListener('hashchange', parseToken);
    return () => window.removeEventListener('hashchange', parseToken);
  }, []);

  const validatePasswordStrength = (pass: string): boolean => {
    const hasLetter = /[a-zA-Z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    return pass.length >= 8 && hasLetter && hasNumber;
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-zA-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    return score;
  };

  const validateField = (name: 'password' | 'confirmPassword', val: string, compareVal?: string): string => {
    if (name === 'password') {
      if (!val) return 'Password is required';
      if (!validatePasswordStrength(val)) {
        return 'Password must be at least 8 characters and contain at least one letter and one number';
      }
      return '';
    } else {
      if (!val) return 'Confirm password is required';
      if (val !== compareVal) return 'Passwords do not match';
      return '';
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (touched.password) {
      const err = validateField('password', val);
      setErrors(prev => ({ ...prev, password: err }));
    }
    if (touched.confirmPassword) {
      const err = validateField('confirmPassword', confirmPassword, val);
      setErrors(prev => ({ ...prev, confirmPassword: err }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (touched.confirmPassword) {
      const err = validateField('confirmPassword', val, password);
      setErrors(prev => ({ ...prev, confirmPassword: err }));
    }
  };

  const handleBlur = (name: 'password' | 'confirmPassword') => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const val = name === 'password' ? password : confirmPassword;
    const err = validateField(name, val, password);
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });

    const passErr = validateField('password', password);
    const confirmErr = validateField('confirmPassword', confirmPassword, password);

    if (passErr || confirmErr) {
      setErrors({ password: passErr, confirmPassword: confirmErr });
      setStatus('error');
      return;
    }

    if (!token) {
      setErrors({ global: 'Token is missing. Please request a new recovery link.' });
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrors({});

    try {
      await authApi.resetPassword({
        token,
        new_password: password
      });

      // Clear any active session first to prevent route guard from redirecting to dashboard
      logout({ silent: true });

      setStatus('success');
      addToast('Your password has been successfully updated.', 'success');
      
      // Auto-redirect to login after 2.5 seconds
      setTimeout(() => {
        window.location.hash = '#login';
      }, 2500);

    } catch (err: any) {
      setStatus('error');
      if (axios.isAxiosError(err) && err.response) {
        const detail = err.response.data?.detail;
        if (Array.isArray(detail)) {
          setErrors({ global: detail[0]?.msg || 'Validation failed on server.' });
        } else {
          setErrors({ global: detail || 'Invalid or expired token.' });
        }
      } else {
        setErrors({ global: 'Failed to connect to the authentication server.' });
      }
    }
  };

  const strength = getPasswordStrength();
  const isSubmitting = status === 'submitting';

  if (!token) {
    return (
      <div className="glass-card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--error-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--error)',
          margin: '0 auto 1.5rem auto',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <ShieldAlert size={32} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Link Unusable</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.95rem' }}>
          This password reset link is invalid, corrupted, or missing its verification token signature. Please request a new recovery link.
        </p>
        <a 
          href="#forgot-password" 
          className="btn-primary"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={16} />
          <span>Request New Token</span>
        </a>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="glass-card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--success)',
          margin: '0 auto 1.5rem auto',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <CheckCircle2 size={32} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Credential Restored</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.95rem' }}>
          Your security ledger has been updated. Redirecting you to the system portal authentication page shortly...
        </p>
        <a 
          href="#login" 
          className="btn-primary"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span>Access Portal Now</span>
        </a>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ maxWidth: '440px', width: '100%' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Establish Password</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Input your new password below. It must be strong and fully secure.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {errors.global && (
          <div className="error-message" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{errors.global}</span>
          </div>
        )}

        {/* Password field */}
        <div className="form-group">
          <label className="form-label" htmlFor="new-password">New Password</label>
          <div className="input-container">
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => handleBlur('password')}
              className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
              placeholder="••••••••"
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            <Lock size={16} className="input-icon" />
          </div>

          {/* Strength bar indicator */}
          <div className="password-strength">
            <div className={`strength-bar ${strength >= 1 ? (strength === 1 ? 'active-weak' : strength === 2 ? 'active-medium' : 'active-strong') : ''}`}></div>
            <div className={`strength-bar ${strength >= 2 ? (strength === 2 ? 'active-medium' : 'active-strong') : ''}`}></div>
            <div className={`strength-bar ${strength === 3 ? 'active-strong' : ''}`}></div>
          </div>

          {touched.password && errors.password && (
            <span className="error-message">
              <AlertCircle size={12} />
              <span>{errors.password}</span>
            </span>
          )}
        </div>

        {/* Confirm password field */}
        <div className="form-group">
          <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
          <div className="input-container">
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={() => handleBlur('confirmPassword')}
              className={`form-input ${touched.confirmPassword && errors.confirmPassword ? 'error' : ''}`}
              placeholder="••••••••"
              disabled={isSubmitting}
              autoComplete="new-password"
            />
            <Lock size={16} className="input-icon" />
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <span className="error-message">
              <AlertCircle size={12} />
              <span>{errors.confirmPassword}</span>
            </span>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isSubmitting || !password || !confirmPassword || Object.values(errors).some(e => !!e)}
          style={{ marginTop: '0.75rem' }}
        >
          {isSubmitting ? (
            <>
              <div className="spinner" />
              <span>Updating Password...</span>
            </>
          ) : (
            <span>Update Password</span>
          )}
        </button>
      </form>
    </div>
  );
};
