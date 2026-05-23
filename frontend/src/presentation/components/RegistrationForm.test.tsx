import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegistrationForm } from './RegistrationForm';
import { authApi } from '../../infrastructure/api/client';
import { ToastProvider } from '../../application/context/ToastContext';

// Mock the API client modules
vi.mock('../../infrastructure/api/client', () => ({
  authApi: {
    register: vi.fn(),
  },
  default: {},
}));

const renderWithToast = (ui: React.ReactElement) => {
  return render(<ToastProvider>{ui}</ToastProvider>);
};

describe('RegistrationForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  });

  it('renders all input fields and the submit button', () => {
    renderWithToast(<RegistrationForm />);
    
    expect(screen.getByLabelText(/Corporate Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Temporary Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Security Role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register New User/i })).toBeInTheDocument();
  });

  it('disables submit button by default (when fields are empty)', () => {
    renderWithToast(<RegistrationForm />);
    const submitBtn = screen.getByRole('button', { name: /Register New User/i });
    expect(submitBtn).toBeDisabled();
  });

  it('validates email format on blur', async () => {
    renderWithToast(<RegistrationForm />);
    const emailInput = screen.getByLabelText(/Corporate Email/i);
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    expect(await screen.findByText(/Please enter a valid corporate email/i)).toBeInTheDocument();
  });

  it('validates password strength criteria on blur', async () => {
    renderWithToast(<RegistrationForm />);
    const passwordInput = screen.getByLabelText(/Temporary Password/i);
    
    // Short password
    fireEvent.change(passwordInput, { target: { value: 'short1' } });
    fireEvent.blur(passwordInput);
    
    expect(await screen.findByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('shows error if first name or last name is blank on blur', async () => {
    renderWithToast(<RegistrationForm />);
    const firstInput = screen.getByLabelText(/First Name/i);
    
    fireEvent.change(firstInput, { target: { value: '   ' } });
    fireEvent.blur(firstInput);
    
    expect(await screen.findByText(/First name is required/i)).toBeInTheDocument();
  });

  it('calls authApi.register on valid submission and triggers success flow', async () => {
    const mockUserResponse = {
      id: '12345',
      email: 'john.doe@corporate.com',
      first_name: 'John',
      last_name: 'Doe',
      role: 'Reviewer' as const,
      is_active: true,
      created_at: '2026-05-23T12:00:00Z',
    };
    
    vi.mocked(authApi.register).mockResolvedValueOnce(mockUserResponse);
    
    renderWithToast(<RegistrationForm />);
    
    fireEvent.change(screen.getByLabelText(/Corporate Email/i), { target: { value: 'john.doe@corporate.com' } });
    fireEvent.change(screen.getByLabelText(/Temporary Password/i), { target: { value: 'Password123' } });
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    
    const submitBtn = screen.getByRole('button', { name: /Register New User/i });
    expect(submitBtn).toBeEnabled();
    
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        email: 'john.doe@corporate.com',
        password: 'Password123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'Reviewer',
      });
    });
    
    // Check form is reset
    expect(screen.getByLabelText(/Corporate Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/Temporary Password/i)).toHaveValue('');
  });

  it('handles 409 conflict error from backend API by displaying inline validation', async () => {
    const mockAxiosError = {
      isAxiosError: true,
      response: {
        status: 409,
        data: { detail: 'Conflict' },
      },
    };
    
    vi.mocked(authApi.register).mockRejectedValueOnce(mockAxiosError);
    
    renderWithToast(<RegistrationForm />);
    
    fireEvent.change(screen.getByLabelText(/Corporate Email/i), { target: { value: 'conflict@corporate.com' } });
    fireEvent.change(screen.getByLabelText(/Temporary Password/i), { target: { value: 'Password123' } });
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Register New User/i }));
    
    expect(await screen.findByText(/This email address is already in use/i)).toBeInTheDocument();
  });
});
