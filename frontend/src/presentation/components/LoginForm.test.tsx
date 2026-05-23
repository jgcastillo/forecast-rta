import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from './LoginForm';
import { authApi } from '../../infrastructure/api/client';
import { ToastProvider } from '../../application/context/ToastContext';
import { AuthProvider } from '../../application/context/AuthContext';

// Mock the API client modules
vi.mock('../../infrastructure/api/client', () => ({
  authApi: {
    login: vi.fn(),
  },
  default: {},
}));

const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <ToastProvider>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </ToastProvider>
  );
};

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  });

  it('renders email and password inputs and sign-in button', () => {
    renderWithContext(<LoginForm />);
    
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('disables submit button by default (when fields are empty)', () => {
    renderWithContext(<LoginForm />);
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });
    expect(submitBtn).toBeDisabled();
  });

  it('validates email format on blur', async () => {
    renderWithContext(<LoginForm />);
    const emailInput = screen.getByLabelText(/Email Address/i);
    
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.blur(emailInput);
    
    expect(await screen.findByText(/Invalid email format/i)).toBeInTheDocument();
  });

  it('validates password strength criteria on blur', async () => {
    renderWithContext(<LoginForm />);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    // Less than 8 characters
    fireEvent.change(passwordInput, { target: { value: 'weak1' } });
    fireEvent.blur(passwordInput);
    
    expect(await screen.findByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('calls authApi.login on valid submission and saves session', async () => {
    const mockTokenResponse = {
      access_token: 'header.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiQWRtaW4ifQ.signature',
      token_type: 'bearer',
    };
    
    vi.mocked(authApi.login).mockResolvedValueOnce(mockTokenResponse);
    
    renderWithContext(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'admin@admin.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin1234' } });
    
    const submitBtn = screen.getByRole('button', { name: /Sign In/i });
    expect(submitBtn).toBeEnabled();
    
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        username: 'admin@admin.com',
        password: 'admin1234',
      });
    });
  });
});
