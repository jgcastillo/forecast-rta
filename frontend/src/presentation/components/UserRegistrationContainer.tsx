import React, { useState } from 'react';
import { UserPlus, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { RegistrationForm } from './RegistrationForm';
import { UserResponse } from '../../infrastructure/api/types';

export const UserRegistrationContainer: React.FC = () => {
  const [lastRegisteredUser, setLastRegisteredUser] = useState<UserResponse | null>(null);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Header section with icon and title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justify-content: center,
          color: 'var(--accent-primary)',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}
        // Center alignment fix
        className="brand-logo"
        >
          <UserPlus size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Account Provisioning</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Administrative console to register new identities with hierarchical system scopes.
          </p>
        </div>
      </div>

      {/* Main glass card wrapping the form */}
      <div className="glass-card">
        <RegistrationForm onSuccess={setLastRegisteredUser} />
      </div>

      {/* Success details helper block */}
      {lastRegisteredUser && (
        <div 
          className="glass-card" 
          style={{ 
            marginTop: '2rem', 
            borderColor: 'rgba(16, 185, 129, 0.3)',
            background: 'rgba(16, 185, 129, 0.05)',
            display: 'flex',
            gap: '1rem',
            padding: '1.5rem'
          }}
        >
          <CheckCircle2 size={24} style={{ color: 'var(--success)', flexShrink: 0 }} />
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Provisioning Complete</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              The account for <strong>{lastRegisteredUser.email}</strong> was provisioned successfully. 
              An administration audit log has been committed to the security ledger.
            </p>
          </div>
        </div>
      )}

      {/* Security warning helper block */}
      <div 
        style={{ 
          marginTop: '2rem', 
          display: 'flex', 
          gap: '0.75rem', 
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(245, 158, 11, 0.05)',
          border: '1px solid rgba(245, 158, 11, 0.2)'
        }}
      >
        <ShieldAlert size={20} style={{ color: 'var(--warning)', flexShrink: 0 }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>
          <strong>Security Notice:</strong> Newly created user accounts default to active status. 
          The temporary password must be securely delivered to the recipient according to corporate policy.
        </p>
      </div>
    </div>
  );
};
