import React from 'react';
import { X, Save, AlertTriangle, ShieldAlert, CheckCircle, Package, Hash, Tag, DollarSign, Box, Navigation, ToggleLeft, ToggleRight } from 'lucide-react';
import { useEditProduct } from '../../application/hooks/useEditProduct';
import { ProductResponse } from '../../infrastructure/api/types';

interface EditProductSlideOverProps {
  product: ProductResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: ProductResponse) => void;
  canEdit?: boolean;
}

export const EditProductSlideOver: React.FC<EditProductSlideOverProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
  canEdit = true,
}) => {
  const {
    formData,
    errors,
    isLoading,
    submitError,
    handleInputChange,
    handleToggleActive,
    submitUpdate,
  } = useEditProduct(product, (updated) => {
    onSuccess(updated);
    onClose();
  });

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    await submitUpdate(e);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
      }}
      className="animate-fade-in"
    >
      {/* Backdrop overlay click to close */}
      <div
        style={{ position: 'absolute', inset: 0 }}
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          background: 'var(--bg-card, #0f172a)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 25px rgba(0, 0, 0, 0.5)',
          overflowY: 'auto',
          zIndex: 10,
        }}
        className="animate-slide-left"
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(99, 102, 241, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary, #6366f1)',
              }}
            >
              <Package size={20} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                Edit Product
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #94a3b8)' }}>
                SKU: {product.code}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary, #94a3b8)',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
          {/* RBAC Restriction Alert */}
          {!canEdit && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <ShieldAlert size={18} />
              <span>Read-only view: You require Analyst or Admin role to save edits.</span>
            </div>
          )}

          {/* Submit Error */}
          {submitError && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertTriangle size={18} />
              <span>{submitError}</span>
            </div>
          )}

          {/* Product Code */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Hash size={14} /> Product Code (SKU)
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              disabled={!canEdit || isLoading}
              className="input-field"
              style={{ width: '100%' }}
            />
            {errors.code && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.code}</span>}
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Tag size={14} /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={!canEdit || isLoading}
              rows={3}
              className="input-field"
              style={{ width: '100%', resize: 'vertical' }}
            />
            {errors.description && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.description}</span>}
          </div>

          {/* Grid fields: Qty per box & Exworks Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Box size={14} /> Qty per Box
              </label>
              <input
                type="number"
                name="qty_per_box"
                value={formData.qty_per_box}
                onChange={handleInputChange}
                disabled={!canEdit || isLoading}
                min={1}
                className="input-field"
                style={{ width: '100%' }}
              />
              {errors.qty_per_box && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.qty_per_box}</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <DollarSign size={14} /> Price ($ USD)
              </label>
              <input
                type="text"
                name="exworks_price"
                value={formData.exworks_price}
                onChange={handleInputChange}
                disabled={!canEdit || isLoading}
                className="input-field"
                style={{ width: '100%' }}
              />
              {errors.exworks_price && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.exworks_price}</span>}
            </div>
          </div>

          {/* Series & Shipping Route */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                Series
              </label>
              <input
                type="text"
                name="series"
                value={formData.series}
                onChange={handleInputChange}
                disabled={!canEdit || isLoading}
                className="input-field"
                style={{ width: '100%' }}
              />
              {errors.series && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.series}</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary, #94a3b8)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Navigation size={14} /> Shipping Route
              </label>
              <select
                name="shipping_route"
                value={formData.shipping_route}
                onChange={handleInputChange}
                disabled={!canEdit || isLoading}
                className="input-field"
                style={{ width: '100%' }}
              >
                <option value="MARITIME">MARITIME</option>
                <option value="AIR">AIR</option>
                <option value="LAND">LAND</option>
              </select>
              {errors.shipping_route && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.shipping_route}</span>}
            </div>
          </div>

          {/* Active Status Switch */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.5rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'block' }}>Product Status</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #94a3b8)' }}>
                {formData.is_active ? 'Active catalog entry (Included in forecast)' : 'Deactivated soft-deleted entry'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => canEdit && handleToggleActive(!formData.is_active)}
              disabled={!canEdit || isLoading}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: canEdit ? 'pointer' : 'not-allowed',
                color: formData.is_active ? 'var(--success, #10b981)' : '#64748b',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {formData.is_active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>

          {/* Footer actions */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canEdit || isLoading}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {isLoading ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
