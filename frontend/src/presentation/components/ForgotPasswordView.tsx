import React, { useState, FormEvent } from 'react';
import { Mail, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { authApi } from '../../infrastructure/api/client';
import axios from 'axios';

export const ForgotPasswordView: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Email is required.');
      setStatus('error');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid corporate email.');
      setStatus('error');
      return;
    }

    setStatus('submitting');

    try {
      await authApi.requestPasswordRecovery(trimmedEmail);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.detail || 'An unexpected error occurred.');
      } else {
        setError('Failed to connect to the authentication server.');
      }
    }
  };

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
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Link Dispatched</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.95rem' }}>
          If **{email}** is registered in our directories, a password recovery token has been logged to the dev terminal console. 
          Use that token link to establish a new credential.
        </p>
        <a 
          href="#login" 
          className="btn-primary"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={16} />
          <span>Return to Access Gate</span>
        </a>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ maxWidth: '440px', width: '100%' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Credential Recovery</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Initiate password recovery. Your single-use access link will be logged to the server logs.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="email-input">Corporate Email</label>
          <div className="input-container">
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${error ? 'error' : ''}`}
              placeholder="name@company.com"
              disabled={status === 'submitting'}
            />
            <Mail size={16} className="input-icon" />
          </div>
          {error && (
            <span className="error-message">
              <ShieldAlert size={12} />
              <span>{error}</span>
            </span>
          )}
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={status === 'submitting' || !email.trim()}
        >
          {status === 'submitting' ? (
            <>
              <div className="spinner" />
              <span>Requesting...</span>
            </>
          ) : (
            <span>Send Reset Token</span>
          )}
        </button>

        <a 
          href="#login" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem', 
            fontSize: '0.85rem', 
            color: 'var(--text-secondary)', 
            textDecoration: 'none',
            marginTop: '0.5rem',
            transition: 'color var(--transition-fast)'
          }}
          className="back-to-login"
        >
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </a>
      </form>
    </div>
  );
};
