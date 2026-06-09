import React from 'react';
import { Tag, FileText, Box, DollarSign, Layers, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { useRegisterProduct } from '../../application/hooks/useRegisterProduct';
import { useToast } from '../../application/context/ToastContext';
import { ProductResponse } from '../../infrastructure/api/types';

interface ProductRegistrationFormProps {
  onSuccess?: (product: ProductResponse) => void;
}

export const ProductRegistrationForm: React.FC<ProductRegistrationFormProps> = ({ onSuccess }) => {
  const { addToast } = useToast();

  const handleSuccess = (product: ProductResponse) => {
    addToast(`Product '${product.code}' registered successfully.`, 'success');
    if (onSuccess) {
      onSuccess(product);
    }
  };

  const {
    formData,
    errors,
    status,
    touched,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useRegisterProduct(handleSuccess);

  const isSubmitting = status === 'submitting';

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {errors.global && (
        <div className="error-message" style={{ marginBottom: '1rem', fontSize: '0.95rem' }} role="alert">
          <AlertCircle size={18} />
          <span>{errors.global}</span>
        </div>
      )}

      {/* Product Code */}
      <div className="form-group">
        <label className="form-label" htmlFor="code">Product Code</label>
        <div className="input-container">
          <input
            id="code"
            name="code"
            type="text"
            className={`form-input ${touched.code && errors.code ? 'error' : ''}`}
            placeholder="e.g. CHAIR-ERGO-01"
            value={formData.code}
            onChange={handleChange}
            onBlur={() => handleBlur('code')}
            disabled={isSubmitting}
            required
          />
          <Tag className="input-icon" size={18} />
        </div>
        {touched.code && errors.code && (
          <div className="error-message" id="code-error">
            <AlertCircle size={14} />
            <span>{errors.code}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="description">Description</label>
        <div className="input-container">
          <input
            id="description"
            name="description"
            type="text"
            className={`form-input ${touched.description && errors.description ? 'error' : ''}`}
            placeholder="e.g. Ergonomic Office Desk Chair with Lumbar Support"
            value={formData.description}
            onChange={handleChange}
            onBlur={() => handleBlur('description')}
            disabled={isSubmitting}
            required
          />
          <FileText className="input-icon" size={18} />
        </div>
        {touched.description && errors.description && (
          <div className="error-message" id="description-error">
            <AlertCircle size={14} />
            <span>{errors.description}</span>
          </div>
        )}
      </div>

      {/* Quantity per Box */}
      <div className="form-group">
        <label className="form-label" htmlFor="qty_per_box">Quantity per Box</label>
        <div className="input-container">
          <input
            id="qty_per_box"
            name="qty_per_box"
            type="number"
            min="1"
            step="1"
            className={`form-input ${touched.qty_per_box && errors.qty_per_box ? 'error' : ''}`}
            placeholder="e.g. 2"
            value={formData.qty_per_box}
            onChange={handleChange}
            onBlur={() => handleBlur('qty_per_box')}
            disabled={isSubmitting}
            required
          />
          <Box className="input-icon" size={18} />
        </div>
        {touched.qty_per_box && errors.qty_per_box && (
          <div className="error-message" id="qty-error">
            <AlertCircle size={14} />
            <span>{errors.qty_per_box}</span>
          </div>
        )}
      </div>

      {/* Exworks Price */}
      <div className="form-group">
        <label className="form-label" htmlFor="exworks_price">Exworks Price (USD)</label>
        <div className="input-container">
          <input
            id="exworks_price"
            name="exworks_price"
            type="text"
            className={`form-input ${touched.exworks_price && errors.exworks_price ? 'error' : ''}`}
            placeholder="e.g. 129.99"
            value={formData.exworks_price}
            onChange={handleChange}
            onBlur={() => handleBlur('exworks_price')}
            disabled={isSubmitting}
            required
          />
          <DollarSign className="input-icon" size={18} />
        </div>
        {touched.exworks_price && errors.exworks_price && (
          <div className="error-message" id="price-error">
            <AlertCircle size={14} />
            <span>{errors.exworks_price}</span>
          </div>
        )}
      </div>

      {/* Series */}
      <div className="form-group">
        <label className="form-label" htmlFor="series">Series</label>
        <div className="input-container">
          <input
            id="series"
            name="series"
            type="text"
            className={`form-input ${touched.series && errors.series ? 'error' : ''}`}
            placeholder="e.g. Office Deluxe"
            value={formData.series}
            onChange={handleChange}
            onBlur={() => handleBlur('series')}
            disabled={isSubmitting}
            required
          />
          <Layers className="input-icon" size={18} />
        </div>
        {touched.series && errors.series && (
          <div className="error-message" id="series-error">
            <AlertCircle size={14} />
            <span>{errors.series}</span>
          </div>
        )}
      </div>

      {/* Shipping Route */}
      <div className="form-group">
        <label className="form-label" htmlFor="shipping_route">Shipping Route</label>
        <div className="input-container">
          <select
            id="shipping_route"
            name="shipping_route"
            className={`form-input ${touched.shipping_route && errors.shipping_route ? 'error' : ''}`}
            style={{ appearance: 'none', paddingRight: '2.5rem' }}
            value={formData.shipping_route}
            onChange={handleChange}
            onBlur={() => handleBlur('shipping_route')}
            disabled={isSubmitting}
            required
          >
            <option value="" disabled>Select Route</option>
            <option value="Maritime">Maritime (Ocean)</option>
            <option value="Air">Air (Express)</option>
          </select>
          <Navigation className="input-icon" size={18} />
          {/* Custom select arrow overlay */}
          <div style={{
            position: 'absolute',
            right: '1rem',
            pointerEvents: 'none',
            color: 'var(--text-muted)',
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid var(--text-muted)'
          }} />
        </div>
        {touched.shipping_route && errors.shipping_route && (
          <div className="error-message" id="route-error">
            <AlertCircle size={14} />
            <span>{errors.shipping_route}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        type="submit"
        className="btn-primary"
        disabled={!isFormValid || isSubmitting}
        style={{ marginTop: '1rem' }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="spinner" />
            <span>Registering Product...</span>
          </>
        ) : (
          <span>Register New Product</span>
        )}
      </button>
    </form>
  );
};
