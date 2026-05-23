import React from 'react';
import { Mail, Lock, User, Shield, Loader2, AlertCircle } from 'lucide-react';
import { useUserRegistration } from '../../application/hooks/useUserRegistration';
import { useToast } from '../../application/context/ToastContext';
import { UserResponse } from '../../infrastructure/api/types';

interface RegistrationFormProps {
  onSuccess?: (user: UserResponse) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccess }) => {
  const { addToast } = useToast();
  
  const handleSuccess = (user: UserResponse) => {
    addToast(`User ${user.email} registered successfully.`, 'success');
    if (onSuccess) {
      onSuccess(user);
    }
  };

  const {
    formData,
    errors,
    status,
    touched,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useUserRegistration(handleSuccess);

  // Helper to determine password strength visual state
  const getPasswordStrength = () => {
    const pass = formData.password;
    if (!pass) return 0;
    
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[a-zA-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    
    return score; // 0, 1, 2, or 3
  };

  const strength = getPasswordStrength();
  const isSubmitting = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errors.global && (
        <div className="error-message" style={{ marginBottom: '1.5rem', fontSize: '0.95rem' }} role="alert">
          <AlertCircle size={18} />
          <span>{errors.global}</span>
        </div>
      )}

      {/* Email Field */}
      <div className="form-group">
        <label className="form-label" htmlFor="email">Corporate Email</label>
        <div className="input-container">
          <input
            id="email"
            name="email"
            type="email"
            className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
            placeholder="name@corporate.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            disabled={isSubmitting}
            required
            autoComplete="email"
          />
          <Mail className="input-icon" size={18} />
        </div>
        {touched.email && errors.email && (
          <div className="error-message" id="email-error">
            <AlertCircle size={14} />
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      {/* Password Field */}
      <div className="form-group">
        <label className="form-label" htmlFor="password">Temporary Password</label>
        <div className="input-container">
          <input
            id="password"
            name="password"
            type="password"
            className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
            placeholder="Min. 8 characters, letters & numbers"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
            disabled={isSubmitting}
            required
            autoComplete="new-password"
          />
          <Lock className="input-icon" size={18} />
        </div>
        
        {/* Dynamic strength indicator */}
        <div className="password-strength">
          <div className={`strength-bar ${strength >= 1 ? (strength === 1 ? 'active-weak' : strength === 2 ? 'active-medium' : 'active-strong') : ''}`}></div>
          <div className={`strength-bar ${strength >= 2 ? (strength === 2 ? 'active-medium' : 'active-strong') : ''}`}></div>
          <div className={`strength-bar ${strength === 3 ? 'active-strong' : ''}`}></div>
        </div>

        {touched.password && errors.password && (
          <div className="error-message" id="password-error">
            <AlertCircle size={14} />
            <span>{errors.password}</span>
          </div>
        )}
      </div>

      {/* First Name Field */}
      <div className="form-group">
        <label className="form-label" htmlFor="first_name">First Name</label>
        <div className="input-container">
          <input
            id="first_name"
            name="first_name"
            type="text"
            className={`form-input ${touched.first_name && errors.first_name ? 'error' : ''}`}
            placeholder="Jane"
            value={formData.first_name}
            onChange={handleChange}
            onBlur={() => handleBlur('first_name')}
            disabled={isSubmitting}
            required
            autoComplete="given-name"
          />
          <User className="input-icon" size={18} />
        </div>
        {touched.first_name && errors.first_name && (
          <div className="error-message" id="first-name-error">
            <AlertCircle size={14} />
            <span>{errors.first_name}</span>
          </div>
        )}
      </div>

      {/* Last Name Field */}
      <div className="form-group">
        <label className="form-label" htmlFor="last_name">Last Name</label>
        <div className="input-container">
          <input
            id="last_name"
            name="last_name"
            type="text"
            className={`form-input ${touched.last_name && errors.last_name ? 'error' : ''}`}
            placeholder="Doe"
            value={formData.last_name}
            onChange={handleChange}
            onBlur={() => handleBlur('last_name')}
            disabled={isSubmitting}
            required
            autoComplete="family-name"
          />
          <User className="input-icon" size={18} />
        </div>
        {touched.last_name && errors.last_name && (
          <div className="error-message" id="last-name-error">
            <AlertCircle size={14} />
            <span>{errors.last_name}</span>
          </div>
        )}
      </div>

      {/* Role Selection Field */}
      <div className="form-group">
        <label className="form-label" htmlFor="role">Security Role</label>
        <div className="input-container">
          <select
            id="role"
            name="role"
            className={`form-input ${touched.role && errors.role ? 'error' : ''}`}
            style={{ appearance: 'none', paddingRight: '2.5rem' }}
            value={formData.role}
            onChange={handleChange}
            onBlur={() => handleBlur('role')}
            disabled={isSubmitting}
            required
          >
            <option value="Reviewer">Reviewer</option>
            <option value="Analyst">Analyst</option>
            <option value="Admin">Admin</option>
          </select>
          <Shield className="input-icon" size={18} />
          {/* Custom select arrow overlay */}
          <div style={{
            position: 'absolute',
            right: '1rem',
            pointerEvents: 'none',
            color: 'var(--text-muted)',
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid var(--text-muted)'
          }} />
        </div>
        {touched.role && errors.role && (
          <div className="error-message" id="role-error">
            <AlertCircle size={14} />
            <span>{errors.role}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        type="submit"
        className="btn-primary"
        disabled={!isFormValid || isSubmitting}
        style={{ marginTop: '1.5rem' }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="spinner" />
            <span>Registering Account...</span>
          </>
        ) : (
          <span>Register New User</span>
        )}
      </button>
    </form>
  );
};
