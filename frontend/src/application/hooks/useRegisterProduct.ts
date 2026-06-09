import { useState, FormEvent, ChangeEvent } from 'react';
import { ProductCreate, ProductResponse } from '../../infrastructure/api/types';
import { catalogApi } from '../../infrastructure/api/client';
import axios from 'axios';

export interface ProductFormErrors {
  code?: string;
  description?: string;
  qty_per_box?: string;
  exworks_price?: string;
  series?: string;
  shipping_route?: string;
  global?: string;
}

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const useRegisterProduct = (onSuccess?: (product: ProductResponse) => void) => {
  const [formData, setFormData] = useState<ProductCreate>({
    code: '',
    description: '',
    qty_per_box: 1, // default greater than 0
    exworks_price: '',
    series: '',
    shipping_route: '',
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: keyof ProductCreate, value: string | number): string => {
    const strValue = String(value).trim();
    
    switch (name) {
      case 'code':
        if (!strValue) return 'Product code is required';
        if (strValue.length > 50) return 'Product code cannot exceed 50 characters';
        return '';
      case 'description':
        if (!strValue) return 'Description is required';
        if (strValue.length > 255) return 'Description cannot exceed 255 characters';
        return '';
      case 'qty_per_box': {
        const num = Number(value);
        if (isNaN(num) || !Number.isInteger(num)) return 'Quantity per box must be an integer';
        if (num <= 0) return 'Quantity per box must be a positive integer greater than zero';
        return '';
      }
      case 'exworks_price': {
        if (!strValue) return 'Exworks price is required';
        const num = Number(strValue);
        if (isNaN(num)) return 'Price must be a valid number';
        if (num < 0) return 'Price cannot be negative';
        // Validate decimal format up to 2 decimal places
        const decimalRegex = /^\d+(\.\d{1,2})?$/;
        if (!decimalRegex.test(strValue)) {
          return 'Price must use a precise format (maximum 2 decimal places)';
        }
        return '';
      }
      case 'series':
        if (!strValue) return 'Series is required';
        return '';
      case 'shipping_route':
        if (!strValue) return 'Shipping route is required';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const key = name as keyof ProductCreate;
    
    // Cast to number if it is qty_per_box
    const finalValue = key === 'qty_per_box' ? (value === '' ? '' : parseInt(value, 10)) : value;
    
    setFormData((prev) => ({ ...prev, [key]: finalValue }));

    if (touched[key]) {
      const fieldError = validateField(key, finalValue);
      setErrors((prev) => ({ ...prev, [key]: fieldError }));
    }
  };

  const handleBlur = (name: keyof ProductCreate) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const value = formData[name];
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      qty_per_box: 1,
      exworks_price: '',
      series: '',
      shipping_route: '',
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
    const newErrors: ProductFormErrors = {};
    let hasErrors = false;

    (Object.keys(formData) as Array<keyof ProductCreate>).forEach((key) => {
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
      const response = await catalogApi.registerProduct({
        code: formData.code.trim(),
        description: formData.description.trim(),
        qty_per_box: Number(formData.qty_per_box),
        exworks_price: String(formData.exworks_price).trim(),
        series: formData.series.trim(),
        shipping_route: formData.shipping_route.trim(),
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
            code: 'This product code is already registered in the catalog.',
          });
        } else if (statusCode === 401 || statusCode === 403) {
          setErrors({
            global: 'Session expired or insufficient catalog modification permissions.',
          });
        } else if (statusCode === 422) {
          const detail = err.response.data?.detail;
          if (Array.isArray(detail)) {
            const fieldErrors: ProductFormErrors = {};
            detail.forEach((errorItem: any) => {
              const fieldName = errorItem.loc?.[errorItem.loc.length - 1] as keyof ProductFormErrors;
              if (fieldName) {
                fieldErrors[fieldName] = errorItem.msg;
              }
            });
            setErrors(fieldErrors);
          } else {
            setErrors({
              global: typeof detail === 'string' ? detail : 'Invalid input submission formatting.',
            });
          }
        } else {
          setErrors({
            global: err.response.data?.detail || 'An unexpected server error occurred.',
          });
        }
      } else {
        setErrors({
          global: 'Failed to connect to the catalog server.',
        });
      }
    }
  };

  const isFormValid =
    formData.code !== '' &&
    formData.description !== '' &&
    formData.qty_per_box > 0 &&
    formData.exworks_price !== '' &&
    formData.series !== '' &&
    formData.shipping_route !== '' &&
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
