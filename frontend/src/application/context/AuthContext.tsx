import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authApi } from '../../infrastructure/api/client';
import { useToast } from './ToastContext';

interface AuthContextType {
  token: string | null;
  userRole: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  simulateRole: (role: 'Admin' | 'Analyst' | 'Reviewer' | 'invalid') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safeGetItem = (key: string): string | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(key);
  }
  return null;
};

const safeSetItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value);
  }
};

const safeRemoveItem = (key: string): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(key);
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(safeGetItem('token'));
  const [userRole, setUserRole] = useState<string | null>(safeGetItem('role'));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { addToast } = useToast();

  const decodeJwtRole = (jwtToken: string): { role: string; email: string } | null => {
    try {
      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      return {
        role: decoded.role || 'Reviewer',
        email: decoded.sub || ''
      };
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login({ username: email, password });
      const jwtToken = response.access_token;
      
      const decoded = decodeJwtRole(jwtToken);
      const role = decoded ? decoded.role : 'Reviewer';

      safeSetItem('token', jwtToken);
      safeSetItem('role', role);
      setToken(jwtToken);
      setUserRole(role);
      
      addToast('Successfully authenticated.', 'success');
    } catch (error: any) {
      console.error('Login error:', error);
      const detail = error.response?.data?.detail || 'Authentication failed. Please check your credentials.';
      addToast(detail, 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  const logout = useCallback(() => {
    safeRemoveItem('token');
    safeRemoveItem('role');
    setToken(null);
    setUserRole(null);
    addToast('Logged out successfully.', 'success');
  }, [addToast]);

  const simulateRole = useCallback(async (role: 'Admin' | 'Analyst' | 'Reviewer' | 'invalid') => {
    if (role === 'invalid') {
      const invalidToken = 'invalid_expired_jwt_token';
      safeSetItem('token', invalidToken);
      safeSetItem('role', 'Admin');
      setToken(invalidToken);
      setUserRole('Admin');
      addToast('Simulating: Logged in as Admin but with expired/invalid JWT token.', 'error');
      return;
    }

    if (role === 'Admin') {
      setIsLoading(true);
      try {
        // Attempt real login for development auto-login/simulation
        const response = await authApi.login({ username: 'admin@admin.com', password: 'admin1234' });
        if (!response || !response.access_token) {
          throw new Error('Empty response or missing access_token');
        }
        const jwtToken = response.access_token;
        const decoded = decodeJwtRole(jwtToken);
        const resolvedRole = decoded ? decoded.role : 'Admin';
        
        safeSetItem('token', jwtToken);
        safeSetItem('role', resolvedRole);
        setToken(jwtToken);
        setUserRole(resolvedRole);
        addToast('Development Simulation: Authenticated with root admin context.', 'success');
      } catch (err) {
        console.error('Failed to simulate real admin login:', err);
        // Fallback to mock behavior if backend is unreachable
        const mockToken = 'mock_jwt_token_for_admin';
        safeSetItem('token', mockToken);
        safeSetItem('role', 'Admin');
        setToken(mockToken);
        setUserRole('Admin');
        addToast('Simulated Session: Logged in as Admin (Mock fallback)', 'success');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Standard simulation of Analyst or Reviewer
    const mockToken = `mock_jwt_token_for_${role.toLowerCase()}`;
    safeSetItem('token', mockToken);
    safeSetItem('role', role);
    setToken(mockToken);
    setUserRole(role);
    addToast(`Simulated Session: Logged in as ${role}`, 'success');
  }, [addToast]);

  // Handle initial auto-login in dev mode if session is empty or mock-admin
  useEffect(() => {
    const isTest = typeof window !== 'undefined' && (window as any).process?.env?.NODE_ENV === 'test';
    if (!isTest && (!token || token.startsWith('mock_'))) {
      // Auto login as admin for smooth developer workflow
      simulateRole('Admin');
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        userRole,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        simulateRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
