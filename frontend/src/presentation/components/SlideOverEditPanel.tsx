import { X, User, Shield, Check } from 'lucide-react';
import { UserResponse } from '../../infrastructure/api/types';
import { useEditUser } from '../../application/hooks/useEditUser';
import { useToast } from '../../application/context/ToastContext';

interface SlideOverEditPanelProps {
  user: UserResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: UserResponse) => void;
}

export const SlideOverEditPanel: React.FC<SlideOverEditPanelProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addToast } = useToast();
  
  const handleEditSuccess = (updatedUser: UserResponse) => {
    addToast(`Successfully updated user ${updatedUser.email}.`, 'success');
    onSuccess(updatedUser);
    onClose();
  };

  const {
    formData,
    errors,
    status,
    touched,
    handleChange,
    handleToggleActive,
    handleBlur,
    handleSubmit,
  } = useEditUser(user, handleEditSuccess);

  if (!user) return null;

  return (
    <div className={`slide-over-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div 
        className="slide-over-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)', fontWeight: 700 }}>
              Profile Control
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>
              Modify Identity
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-sm)',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
            className="toast-close"
          >
            <X size={18} />
          </button>
        </div>

        {/* User context banner (Distinctive display details) */}
        <div style={{
          background: 'var(--accent-gradient)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-glow)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            right: '-10%',
            bottom: '-10%',
            opacity: 0.1,
            transform: 'rotate(-15deg)',
            pointerEvents: 'none'
          }}>
            <User size={120} />
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8 }}>Active User Directory ID</span>
          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, wordBreak: 'break-all', fontFamily: 'var(--font-display)' }}>
            {user.email}
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            Joined on {new Date(user.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Global form errors */}
        {errors.global && (
          <div style={{
            padding: '1rem',
            background: 'var(--error-glow)',
            border: '1px solid var(--error)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--error)',
            fontSize: '0.85rem',
            fontWeight: 500
          }}>
            {errors.global}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flexGrow: 1 }}>
            
            {/* First Name */}
            <div className="form-group">
              <label className="form-label">First Name</label>
              <div className="input-container">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleChange}
                  onBlur={() => handleBlur('first_name')}
                  className={`form-input ${errors.first_name ? 'error' : ''}`}
                  placeholder="Enter first name"
                  disabled={status === 'submitting'}
                />
                <User size={16} className="input-icon" />
              </div>
              {errors.first_name && touched.first_name && (
                <span className="error-message">{errors.first_name}</span>
              )}
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <div className="input-container">
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleChange}
                  onBlur={() => handleBlur('last_name')}
                  className={`form-input ${errors.last_name ? 'error' : ''}`}
                  placeholder="Enter last name"
                  disabled={status === 'submitting'}
                />
                <User size={16} className="input-icon" />
              </div>
              {errors.last_name && touched.last_name && (
                <span className="error-message">{errors.last_name}</span>
              )}
            </div>

            {/* Role Select */}
            <div className="form-group">
              <label className="form-label">Hierarchical Scope (Role)</label>
              <div className="input-container">
                <select
                  name="role"
                  value={formData.role || 'Reviewer'}
                  onChange={handleChange}
                  onBlur={() => handleBlur('role')}
                  className={`form-input ${errors.role ? 'error' : ''}`}
                  style={{ paddingLeft: '2.75rem', appearance: 'none', backgroundPosition: 'right 1rem center' }}
                  disabled={status === 'submitting'}
                >
                  <option value="Admin">Administrator</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Reviewer">Reviewer</option>
                </select>
                <Shield size={16} className="input-icon" />
              </div>
              {errors.role && touched.role && (
                <span className="error-message">{errors.role}</span>
              )}
            </div>

            {/* Status Toggle Switch */}
            <div className="switch-container">
              <div className="switch-label">
                <span className="switch-title">Account State</span>
                <span className="switch-desc">
                  {formData.is_active 
                    ? 'Account is active and allowed access' 
                    : 'Account is suspended / deactivated'}
                </span>
              </div>
              <button
                type="button"
                className={`switch-btn ${formData.is_active ? 'active' : ''}`}
                onClick={() => handleToggleActive(!formData.is_active)}
                disabled={status === 'submitting'}
              >
                <span className="switch-thumb" />
              </button>
            </div>

          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <button
              type="button"
              className="btn-primary"
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-secondary)',
                boxShadow: 'none'
              }}
              onClick={onClose}
              disabled={status === 'submitting'}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 2 }}
              disabled={status === 'submitting' || Object.values(errors).some(e => !!e)}
            >
              {status === 'submitting' ? (
                <>
                  <div className="spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
