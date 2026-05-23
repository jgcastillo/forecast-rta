import { useState, FormEvent, ChangeEvent } from 'react';
import { UserCreate, UserResponse } from '../../infrastructure/api/types';
import { authApi } from '../../infrastructure/api/client';
import axios from 'axios';

export interface FormErrors {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  global?: string;
}

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const useUserRegistration = (onSuccess?: (user: UserResponse) => void) => {
  const [formData, setFormData] = useState<UserCreate>({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'Reviewer', // Default per specification
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // Required, Min 8 chars, 1 alphabetical/letter, 1 number.
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= 8 && hasLetter && hasNumber;
  };

  const validateField = (name: keyof UserCreate, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!validateEmail(value)) return 'Please enter a valid corporate email';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        if (!validatePassword(value)) {
          return 'Password must be at least 8 characters and contain at least one letter and one number';
        }
        return '';
      case 'first_name':
        if (!value.trim()) return 'First name is required';
        if (value.length > 100) return 'First name cannot exceed 100 characters';
        return '';
      case 'last_name':
        if (!value.trim()) return 'Last name is required';
        if (value.length > 100) return 'Last name cannot exceed 100 characters';
        return '';
      case 'role':
        if (!value) return 'Role is required';
        if (!['Admin', 'Analyst', 'Reviewer'].includes(value)) return 'Invalid role selected';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const key = name as keyof UserCreate;
    setFormData((prev) => ({ ...prev, [key]: value }));

    if (touched[key]) {
      const fieldError = validateField(key, value);
      setErrors((prev) => ({ ...prev, [key]: fieldError }));
    }
  };

  const handleBlur = (name: keyof UserCreate) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const value = formData[name];
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 'Reviewer',
    });
    setErrors({});
    setTouched({});
    setStatus('idle');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    // Validate all fields
    const newErrors: FormErrors = {};
    let hasErrors = false;

    (Object.keys(formData) as Array<keyof UserCreate>).forEach((key) => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrors({});

    try {
      const response = await authApi.register({
        email: formData.email.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        role: formData.role,
        password: formData.password,
      });
      
      setStatus('success');
      resetForm();
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err: any) {
      setStatus('error');
      if (axios.isAxiosError(err) && err.response) {
        const statusCode = err.response.status;
        if (statusCode === 409) {
          setErrors({
            email: 'This email address is already in use.',
          });
        } else if (statusCode === 401 || statusCode === 403) {
          setErrors({
            global: 'Session expired or insufficient permissions.',
          });
        } else if (statusCode === 422) {
          const detail = err.response.data?.detail;
          if (Array.isArray(detail)) {
            const fieldErrors: FormErrors = {};
            detail.forEach((errorItem: any) => {
              const fieldName = errorItem.loc?.[errorItem.loc.length - 1] as keyof FormErrors;
              if (fieldName) {
                fieldErrors[fieldName] = errorItem.msg;
              }
            });
            setErrors(fieldErrors);
          } else {
            setErrors({
              global: typeof detail === 'string' ? detail : 'Unprocessable Entity error from server.',
            });
          }
        } else {
          setErrors({
            global: err.response.data?.detail || 'An unexpected server error occurred.',
          });
        }
      } else {
        setErrors({
          global: 'Failed to connect to the authentication server.',
        });
      }
    }
  };

  const isFormValid =
    formData.email !== '' &&
    formData.password !== '' &&
    formData.first_name !== '' &&
    formData.last_name !== '' &&
    Object.values(errors).every((err) => !err);

  return {
    formData,
    errors,
    status,
    touched,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
};
