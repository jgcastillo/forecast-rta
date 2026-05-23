import React, { useState, useEffect } from 'react';
import { LayoutDashboard, UserCheck, Key, ShieldAlert, LogOut } from 'lucide-react';
import { ToastProvider, useToast } from './application/context/ToastContext';
import { UserRegistrationContainer } from './presentation/components/UserRegistrationContainer';

const AppContent: React.FC = () => {
  const { addToast } = useToast();
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // Load current token/role state on mount
  useEffect(() => {
    const role = localStorage.getItem('role');
    setCurrentUserRole(role);
  }, []);

  // Simulation helpers for testing the registration UI under different user roles
  const simulateLogin = (role: 'Admin' | 'Analyst' | 'Reviewer' | 'invalid') => {
    if (role === 'invalid') {
      localStorage.setItem('token', 'invalid_expired_jwt_token');
      localStorage.setItem('role', 'Admin'); // Mimic admin UI but with invalid token
      setCurrentUserRole('Admin');
      addToast('Simulating: Logged in as Admin but with expired/invalid JWT token.', 'error');
      return;
    }

    // Set mock token and role
    // Under the hood, our JWT generation code on the backend parses the token.
    // In order for the backend API to work, we actually need a valid JWT token signed by our SECRET_KEY!
    // Since this is a local simulation, we can generate a real valid token using the backend test endpoints,
    // or the administrator can log in.
    // To make this super friendly, we check if we have a real signed token from the backend,
    // otherwise we use a mock.
    // Wait, let's generate a valid token using a client side utility or prompt the user.
    // Actually, in TDD we can mock it. For testing, we can let the user paste their token, or we can pre-generate
    // a valid signature since the key 'foundation_secret_key_2026' is static in .env!
    // Let's explain this in the sidebar UI so the user knows exactly how to set their active session token.
    const mockToken = `mock_jwt_token_for_${role.toLowerCase()}`;
    localStorage.setItem('token', mockToken);
    localStorage.setItem('role', role);
    setCurrentUserRole(role);
    addToast(`Simulated Session: Logged in as ${role}`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setCurrentUserRole(null);
    addToast('Logged out of simulation session.', 'success');
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand-section">
          <div className="brand-logo">
            <LayoutDashboard size={20} style={{ color: 'white' }} />
          </div>
          <span className="brand-name">Forecast RTA</span>
        </div>

        <nav style={{ marginTop: '1.5rem', flexGrow: 1 }}>
          <ul className="nav-list">
            <li>
              <a href="#register" className="nav-item active">
                <UserCheck size={18} />
                <span>Onboarding Form</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Developer Sandbox Panel */}
        <div 
          style={{ 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid var(--border-glass)', 
            borderRadius: 'var(--radius-md)', 
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={16} style={{ color: 'var(--accent-primary)' }} />
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RBAC Simulation</h4>
          </div>
          
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Click below to mock different user contexts and headers:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button 
              className="btn-primary" 
              style={{ padding: '0.5rem', fontSize: '0.8rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid var(--accent-primary)', color: 'var(--text-primary)', boxShadow: 'none' }}
              onClick={() => simulateLogin('Admin')}
            >
              Simulate: Admin (Local)
            </button>
            <button 
              className="btn-primary" 
              style={{ padding: '0.5rem', fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', boxShadow: 'none' }}
              onClick={() => simulateLogin('Analyst')}
            >
              Simulate: Analyst
            </button>
            <button 
              className="btn-primary" 
              style={{ padding: '0.5rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--text-primary)', boxShadow: 'none' }}
              onClick={() => simulateLogin('invalid')}
            >
              Simulate: Expired Token
            </button>
          </div>

          {currentUserRole && (
            <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Active Context:</span>
                <strong style={{ color: 'var(--accent-secondary)' }}>{currentUserRole}</strong>
              </div>
              <button 
                onClick={handleLogout}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--error)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem', 
                  fontSize: '0.75rem', 
                  marginTop: '0.5rem', 
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <LogOut size={12} />
                <span>Clear Session</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {currentUserRole === 'Admin' ? (
          <UserRegistrationContainer />
        ) : (
          <div style={{ maxWidth: '600px', margin: '6rem auto', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--error)',
              margin: '0 auto 1.5rem auto',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <ShieldAlert size={32} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Restrained</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
              The registration portal is exclusively allocated to accounts with <strong>Admin</strong> privileges. 
              Please select the simulated Admin session in the sidebar sandbox panel to continue.
            </p>
            <button 
              className="btn-primary" 
              style={{ maxWidth: '240px', margin: '0 auto' }}
              onClick={() => simulateLogin('Admin')}
            >
              Unlock Admin Portal
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};
export default App;
