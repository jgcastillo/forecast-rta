import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { UserResponse, UserUpdate } from '../../infrastructure/api/types';
import { authApi } from '../../infrastructure/api/client';
import axios from 'axios';

export interface EditFormErrors {
  first_name?: string;
  last_name?: string;
  role?: string;
  global?: string;
}

export type EditFormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const useEditUser = (
  user: UserResponse | null,
  onSuccess?: (updatedUser: UserResponse) => void
) => {
  const [formData, setFormData] = useState<UserUpdate>({
    first_name: '',
    last_name: '',
    role: 'Reviewer',
    is_active: true,
  });

  const [errors, setErrors] = useState<EditFormErrors>({});
  const [status, setStatus] = useState<EditFormStatus>('idle');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Prefill when the user changes
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_active: user.is_active,
      });
      setErrors({});
      setTouched({});
      setStatus('idle');
    }
  }, [user]);

  const validateField = (name: keyof UserUpdate, value: any): string => {
    switch (name) {
      case 'first_name':
        if (typeof value === 'string' && !value.trim()) return 'First name is required';
        if (typeof value === 'string' && value.length > 100) return 'First name cannot exceed 100 characters';
        return '';
      case 'last_name':
        if (typeof value === 'string' && !value.trim()) return 'Last name is required';
        if (typeof value === 'string' && value.length > 100) return 'Last name cannot exceed 100 characters';
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
    const { name, value, type } = e.target;
    const key = name as keyof UserUpdate;
    
    let resolvedValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      resolvedValue = e.target.checked;
    }
    
    setFormData((prev) => ({ ...prev, [key]: resolvedValue }));

    if (touched[key]) {
      const fieldError = validateField(key, resolvedValue);
      setErrors((prev) => ({ ...prev, [key]: fieldError }));
    }
  };

  const handleToggleActive = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: checked }));
  };

  const handleBlur = (name: keyof UserUpdate) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const value = formData[name];
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate all fields
    const newErrors: EditFormErrors = {};
    let hasErrors = false;

    (Object.keys(formData) as Array<keyof UserUpdate>).forEach((key) => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        if (key === 'first_name' || key === 'last_name' || key === 'role') {
          newErrors[key] = errorMsg;
        }
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
      const updatedUser = await authApi.updateUser(user.id, {
        first_name: formData.first_name?.trim(),
        last_name: formData.last_name?.trim(),
        role: formData.role,
        is_active: formData.is_active,
      });

      setStatus('success');
      if (onSuccess) {
        onSuccess(updatedUser);
      }
    } catch (err: any) {
      setStatus('error');
      if (axios.isAxiosError(err) && err.response) {
        const statusCode = err.response.status;
        if (statusCode === 401 || statusCode === 403) {
          setErrors({
            global: 'Session expired or insufficient permissions.',
          });
        } else if (statusCode === 422) {
          const detail = err.response.data?.detail;
          if (Array.isArray(detail)) {
            const fieldErrors: EditFormErrors = {};
            detail.forEach((errorItem: any) => {
              const fieldName = errorItem.loc?.[errorItem.loc.length - 1] as keyof EditFormErrors;
              if (fieldName) {
                fieldErrors[fieldName] = errorItem.msg;
              }
            });
            setErrors(fieldErrors);
          } else {
            setErrors({
              global: typeof detail === 'string' ? detail : 'Validation error from server.',
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

  return {
    formData,
    errors,
    status,
    touched,
    handleChange,
    handleToggleActive,
    handleBlur,
    handleSubmit,
  };
};
