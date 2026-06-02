import React, { useState, useEffect } from 'react';
import { UserPlus, ShieldAlert, Users, Edit2, Shield, Circle } from 'lucide-react';
import { RegistrationForm } from './RegistrationForm';
import { SlideOverEditPanel } from './SlideOverEditPanel';
import { UserResponse } from '../../infrastructure/api/types';
import { authApi } from '../../infrastructure/api/client';
import { useToast } from '../../application/context/ToastContext';

type TabType = 'directory' | 'onboard';

export const UserRegistrationContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('directory');
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastRegisteredUser, setLastRegisteredUser] = useState<UserResponse | null>(null);
  
  // Slide Over Edit states
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  const { addToast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await authApi.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Fetch users error:', err);
      addToast('Failed to load user directory.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegisterSuccess = (newUser: UserResponse) => {
    setLastRegisteredUser(newUser);
    fetchUsers();
    // Redirect to directory tab after registration for visual feedback
    setActiveTab('directory');
    addToast(`Successfully registered ${newUser.email}.`, 'success');
  };

  const handleEditClick = (user: UserResponse) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleEditSuccess = () => {
    fetchUsers();
  };

  const getInitials = (firstName: string, lastName: string) => {
    const f = firstName?.[0] || '';
    const l = lastName?.[0] || '';
    return (f + l).toUpperCase() || '?';
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}
        className="brand-logo"
        >
          {activeTab === 'directory' ? <Users size={24} /> : <UserPlus size={24} />}
        </div>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Administrative Directory</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Administrative console to provision, audit, and modify hierarchical system identities.
          </p>
        </div>
      </div>

      {/* Tabs Controller */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
          onClick={() => setActiveTab('directory')}
        >
          User Registry
        </button>
        <button
          className={`tab-btn ${activeTab === 'onboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('onboard')}
        >
          Provision Account
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'directory' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <div className="spinner" style={{ width: '32px', height: '32px' }} />
            </div>
          ) : users.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
              <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Identities Found</h4>
              <p style={{ color: 'var(--text-secondary)' }}>There are no registered users in the database.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Identity</th>
                    <th>System Scope</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      {/* Name & Avatar Column */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div className="avatar">
                            {getInitials(user.first_name, user.last_name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                              {user.first_name} {user.last_name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Role Badge Column */}
                      <td>
                        <span className={`badge ${user.role.toLowerCase()}`}>
                          <Shield size={12} />
                          <span>{user.role}</span>
                        </span>
                      </td>

                      {/* Status Column */}
                      <td>
                        <span className={`badge ${user.is_active ? 'success' : 'error'}`}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: user.is_active ? 'var(--success)' : 'var(--error)',
                            display: 'inline-block'
                          }} />
                          <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                        </span>
                      </td>

                      {/* Action Column */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleEditClick(user)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.85rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            transition: 'var(--transition-fast)'
                          }}
                          className="btn-primary"
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="glass-card">
            <RegistrationForm onSuccess={handleRegisterSuccess} />
          </div>
        </div>
      )}

      {/* Slide Over Edit Panel Component */}
      <SlideOverEditPanel
        user={selectedUser}
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={handleEditSuccess}
      />

      {/* Success details helper block */}
      {lastRegisteredUser && activeTab === 'directory' && (
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
          <Circle size={24} style={{ fill: 'var(--success)', color: 'var(--success)', flexShrink: 0 }} />
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
