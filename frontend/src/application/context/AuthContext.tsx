import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import apiClient, { authApi } from '../../infrastructure/api/client';
import { useToast } from './ToastContext';

interface AuthContextType {
  token: string | null;
  userRole: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: (options?: { silent?: boolean }) => void;
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

const getInitialValidToken = (): string | null => {
  const t = safeGetItem('token');
  if (t && t !== 'undefined' && t !== 'null' && t.trim() !== '' && t.split('.').length === 3) {
    return t;
  }
  safeRemoveItem('token');
  safeRemoveItem('role');
  return null;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getInitialValidToken());
  const [userRole, setUserRole] = useState<string | null>(token ? safeGetItem('role') : null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { addToast } = useToast();

  const decodeJwtRole = (jwtToken: string): { role: string; email: string } | null => {
    try {
      if (jwtToken.split('.').length !== 3) return null;
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

  const logout = useCallback((options?: { silent?: boolean }) => {
    safeRemoveItem('token');
    safeRemoveItem('role');
    setToken(null);
    setUserRole(null);
    if (!options?.silent) {
      addToast('Logged out successfully.', 'success');
    }
  }, [addToast]);

  const simulateRole = useCallback(async (role: 'Admin' | 'Analyst' | 'Reviewer' | 'invalid') => {
    if (role === 'invalid') {
      const invalidToken = 'invalid.expired.jwt';
      safeSetItem('token', invalidToken);
      safeSetItem('role', 'Admin');
      setToken(invalidToken);
      setUserRole('Admin');
      addToast('Simulating: Logged in as Admin but with expired/invalid JWT token.', 'error');
      return;
    }

    const credentialsMap: Record<string, { email: string; pass: string }> = {
      Admin: { email: 'admin@admin.com', pass: 'admin1234' },
      Analyst: { email: 'analyst@admin.com', pass: 'analyst1234' },
      Reviewer: { email: 'reviewer@admin.com', pass: 'reviewer1234' },
    };

    const targetCreds = credentialsMap[role] || credentialsMap.Admin;

    setIsLoading(true);
    try {
      const response = await authApi.login({ username: targetCreds.email, password: targetCreds.pass });
      if (!response || !response.access_token) {
        throw new Error('Empty response or missing access_token');
      }
      const jwtToken = response.access_token;
      const decoded = decodeJwtRole(jwtToken);
      const resolvedRole = decoded ? decoded.role : role;
      
      safeSetItem('token', jwtToken);
      safeSetItem('role', resolvedRole);
      setToken(jwtToken);
      setUserRole(resolvedRole);
      addToast(`Development Simulation: Authenticated as ${resolvedRole}.`, 'success');
    } catch (err) {
      console.error(`Failed to simulate ${role} login:`, err);
      safeRemoveItem('token');
      safeRemoveItem('role');
      setToken(null);
      setUserRole(null);
      addToast(`Unable to authenticate simulated session for ${role}. Please log in manually.`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // Handle initial auto-login in dev mode if token is missing
  useEffect(() => {
    const isTest = typeof window !== 'undefined' && (window as any).process?.env?.NODE_ENV === 'test';
    const isPublicRecovery = 
      typeof window !== 'undefined' && 
      (window.location.hash === '#forgot-password' || 
       window.location.hash.startsWith('#reset-password') ||
       window.location.pathname === '/forgot-password' ||
       window.location.pathname.startsWith('/reset-password'));

    if (!isTest && !isPublicRecovery && !token) {
      simulateRole('Admin');
    }
  }, []);

  // Intercept 401 Unauthorized responses to immediately clean local session and redirect to #login
  useEffect(() => {
    if (!apiClient?.interceptors?.response) {
      return;
    }

    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const url = error.config?.url || '';
          const isPublicApi = url.includes('/auth/login') || url.includes('/auth/password-recovery') || url.includes('/auth/reset-password');
          
          if (!isPublicApi) {
            logout({ silent: true });
            addToast('Session expired or unauthorized. Please log in again.', 'error');
            window.location.hash = '#login';
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      if (apiClient?.interceptors?.response) {
        apiClient.interceptors.response.eject(interceptor);
      }
    };
  }, [logout, addToast]);

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
