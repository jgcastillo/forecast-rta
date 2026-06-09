import React, { useState, useEffect } from 'react';
import { LayoutDashboard, UserCheck, Key, ShieldAlert, LogOut, Package } from 'lucide-react';
import { ToastProvider } from './application/context/ToastContext';
import { AuthProvider, useAuth } from './application/context/AuthContext';
import { ThemeProvider } from './application/context/ThemeContext';
import { ThemeToggle } from './presentation/components/ThemeToggle';
import { UserRegistrationContainer } from './presentation/components/UserRegistrationContainer';
import { LoginForm } from './presentation/components/LoginForm';
import { ForgotPasswordView } from './presentation/components/ForgotPasswordView';
import { ResetPasswordView } from './presentation/components/ResetPasswordView';
import { ProductCatalogContainer } from './presentation/components/ProductCatalogContainer';

const AppContent: React.FC = () => {
  const { userRole, isAuthenticated, logout, simulateRole } = useAuth();
  
  // Extract correct route from hash or fallback to pathname
  const getInitialPath = () => {
    const hash = window.location.hash;
    const path = window.location.pathname;
    if (hash) return hash;
    if (path === '/forgot-password') return '#forgot-password';
    if (path.startsWith('/reset-password')) {
      const search = window.location.search;
      return `#reset-password${search}`;
    }
    if (path === '/login') return '#login';
    return '#login';
  };

  const [currentPath, setCurrentPath] = useState(getInitialPath());

  // Monitor URL changes for routing and sync pathname to hash
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#login');
    };

    // Sync initial pathname routes to hash-based routes immediately
    const path = window.location.pathname;
    if (path === '/forgot-password') {
      window.location.replace('/#forgot-password');
    } else if (path.startsWith('/reset-password')) {
      const search = window.location.search;
      window.location.replace(`/#reset-password${search}`);
    } else if (path === '/login') {
      window.location.replace('/#login');
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Route guard: Redirect unauthenticated users to #login (or allowed public routes), and logged-in users to #register
  useEffect(() => {
    const isPublicRoute = 
      currentPath === '#login' || 
      currentPath === '#forgot-password' || 
      currentPath.startsWith('#reset-password');

    if (!isAuthenticated) {
      if (!isPublicRoute) {
        window.location.hash = '#login';
      }
    } else {
      // Authenticated users on the login gate are redirected to onboarding or product catalog depending on their role.
      // Public recovery screens should remain fully accessible without forcing layout wrappers.
      if (currentPath === '#login') {
        window.location.hash = userRole === 'Admin' ? '#register' : '#products';
      }
    }
  }, [isAuthenticated, currentPath]);

  // Public login, forgot-password, and reset-password page layout
  if (!isAuthenticated || currentPath === '#login' || currentPath === '#forgot-password' || currentPath.startsWith('#reset-password')) {
    let formComponent = <LoginForm />;
    if (currentPath === '#forgot-password') {
      formComponent = <ForgotPasswordView />;
    } else if (currentPath.startsWith('#reset-password')) {
      formComponent = <ResetPasswordView />;
    }

    return (
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          padding: '2rem',
          backgroundColor: 'var(--bg-primary)',
          transition: 'background-color var(--transition-normal)'
        }}
      >
        {formComponent}
      </div>
    );
  }

  // Private application layout with sidebar
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
            {userRole === 'Admin' && (
              <li>
                <a href="#register" className={`nav-item ${currentPath === '#register' ? 'active' : ''}`}>
                  <UserCheck size={18} />
                  <span>Onboarding Form</span>
                </a>
              </li>
            )}
            <li>
              <a href="#products" className={`nav-item ${currentPath === '#products' ? 'active' : ''}`}>
                <Package size={18} />
                <span>Product Catalog</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Theme Toggle Switch */}
        <div style={{ marginTop: 'auto', marginBottom: '0.25rem' }}>
          <ThemeToggle />
        </div>

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
              onClick={() => simulateRole('Admin')}
            >
              Simulate: Admin (Local)
            </button>
            <button 
              className="btn-primary" 
              style={{ padding: '0.5rem', fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)', color: 'var(--text-primary)', boxShadow: 'none' }}
              onClick={() => simulateRole('Analyst')}
            >
              Simulate: Analyst
            </button>
            <button 
              className="btn-primary" 
              style={{ padding: '0.5rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--text-primary)', boxShadow: 'none' }}
              onClick={() => simulateRole('invalid')}
            >
              Simulate: Expired Token
            </button>
          </div>

          <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Active Context:</span>
              <strong style={{ color: 'var(--accent-secondary)' }}>{userRole}</strong>
            </div>
            <button 
              onClick={() => logout()}
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
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {currentPath === '#products' ? (
          userRole === 'Admin' || userRole === 'Analyst' ? (
            <ProductCatalogContainer />
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
                The product catalog management system is restricted to accounts with <strong>Admin</strong> or <strong>Analyst</strong> privileges.
              </p>
            </div>
          )
        ) : currentPath === '#register' && userRole === 'Admin' ? (
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
              onClick={() => simulateRole('Admin')}
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
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
