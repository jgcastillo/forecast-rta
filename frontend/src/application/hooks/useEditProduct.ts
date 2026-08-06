import { useState, useEffect } from 'react';
import { catalogApi } from '../../infrastructure/api/client';
import { ProductResponse, ProductUpdate } from '../../infrastructure/api/types';

export interface UseEditProductReturn {
  formData: {
    code: string;
    description: string;
    qty_per_box: string;
    exworks_price: string;
    series: string;
    shipping_route: string;
    is_active: boolean;
  };
  errors: Record<string, string>;
  isLoading: boolean;
  submitError: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleToggleActive: (active: boolean) => void;
  submitUpdate: (e?: React.FormEvent) => Promise<ProductResponse | null>;
  resetForm: () => void;
  setTargetProduct: (product: ProductResponse | null) => void;
}

export const useEditProduct = (
  initialProduct: ProductResponse | null = null,
  onSuccess?: (updated: ProductResponse) => void
): UseEditProductReturn => {
  const [product, setProduct] = useState<ProductResponse | null>(initialProduct);
  const [formData, setFormData] = useState({
    code: initialProduct?.code || '',
    description: initialProduct?.description || '',
    qty_per_box: initialProduct ? String(initialProduct.qty_per_box) : '',
    exworks_price: initialProduct?.exworks_price || '',
    series: initialProduct?.series || '',
    shipping_route: initialProduct?.shipping_route || '',
    is_active: initialProduct?.is_active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      setFormData({
        code: initialProduct.code,
        description: initialProduct.description,
        qty_per_box: String(initialProduct.qty_per_box),
        exworks_price: initialProduct.exworks_price,
        series: initialProduct.series,
        shipping_route: initialProduct.shipping_route,
        is_active: initialProduct.is_active,
      });
      setErrors({});
      setSubmitError(null);
    }
  }, [initialProduct]);

  const setTargetProduct = (prod: ProductResponse | null) => {
    setProduct(prod);
    if (prod) {
      setFormData({
        code: prod.code,
        description: prod.description,
        qty_per_box: String(prod.qty_per_box),
        exworks_price: prod.exworks_price,
        series: prod.series,
        shipping_route: prod.shipping_route,
        is_active: prod.is_active,
      });
      setErrors({});
      setSubmitError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setSubmitError(null);
  };

  const handleToggleActive = (active: boolean) => {
    setFormData((prev) => ({ ...prev, is_active: active }));
    setSubmitError(null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Product SKU code is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    const qty = parseInt(formData.qty_per_box, 10);
    if (isNaN(qty) || qty <= 0) {
      newErrors.qty_per_box = 'Quantity per box must be a positive integer';
    }

    const price = parseFloat(formData.exworks_price);
    if (isNaN(price) || price < 0) {
      newErrors.exworks_price = 'Price must be a non-negative decimal';
    }

    if (!formData.series.trim()) {
      newErrors.series = 'Series classification is required';
    }
    if (!formData.shipping_route.trim()) {
      newErrors.shipping_route = 'Shipping route is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitUpdate = async (e?: React.FormEvent): Promise<ProductResponse | null> => {
    if (e) e.preventDefault();
    if (!product) {
      setSubmitError('No product selected for modification.');
      return null;
    }

    if (!validate()) return null;

    setIsLoading(true);
    setSubmitError(null);

    try {
      const payload: ProductUpdate = {};
      if (formData.code.trim() !== product.code) {
        payload.code = formData.code.trim();
      }
      if (formData.description.trim() !== product.description) {
        payload.description = formData.description.trim();
      }
      const parsedQty = parseInt(formData.qty_per_box, 10);
      if (parsedQty !== product.qty_per_box) {
        payload.qty_per_box = parsedQty;
      }
      if (formData.exworks_price !== product.exworks_price) {
        payload.exworks_price = formData.exworks_price;
      }
      if (formData.series.trim() !== product.series) {
        payload.series = formData.series.trim();
      }
      if (formData.shipping_route.trim() !== product.shipping_route) {
        payload.shipping_route = formData.shipping_route.trim();
      }
      if (formData.is_active !== product.is_active) {
        payload.is_active = formData.is_active;
      }

      const updated = await catalogApi.updateProduct(product.id, payload);
      if (onSuccess) {
        onSuccess(updated);
      }
      return updated;
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Failed to update product details';
      setSubmitError(typeof msg === 'string' ? msg : JSON.stringify(msg));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    if (product) {
      setFormData({
        code: product.code,
        description: product.description,
        qty_per_box: String(product.qty_per_box),
        exworks_price: product.exworks_price,
        series: product.series,
        shipping_route: product.shipping_route,
        is_active: product.is_active,
      });
    }
    setErrors({});
    setSubmitError(null);
  };

  return {
    formData,
    errors,
    isLoading,
    submitError,
    handleInputChange,
    handleToggleActive,
    submitUpdate,
    resetForm,
    setTargetProduct,
  };
};
