import React, { useState } from 'react';
import { Package, CheckCircle, Plus, X } from 'lucide-react';
import { ProductCatalogTable } from './ProductCatalogTable';
import { ProductRegistrationForm } from './ProductRegistrationForm';
import { EditProductSlideOver } from './EditProductSlideOver';
import { ProductResponse, UserRole } from '../../infrastructure/api/types';

interface ProductCatalogContainerProps {
  userRole?: UserRole;
}

export const ProductCatalogContainer: React.FC<ProductCatalogContainerProps> = ({ userRole = 'Analyst' }) => {
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState<boolean>(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const canEdit = userRole === 'Admin' || userRole === 'Analyst';

  const handleEditProduct = (product: ProductResponse) => {
    setEditingProduct(product);
    setIsEditDrawerOpen(true);
  };

  const handleRegisterSuccess = (newProduct: ProductResponse) => {
    setIsRegisterModalOpen(false);
    setNotification({
      message: `Product SKU "${newProduct.code}" registered successfully!`,
      type: 'success',
    });
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEditSuccess = (updatedProduct: ProductResponse) => {
    setNotification({
      message: `Product SKU "${updatedProduct.code}" updated successfully!`,
      type: 'success',
    });
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Toast Notification */}
      {notification && (
        <div
          className="glass-card animate-slide-down"
          style={{
            borderColor: 'rgba(16, 185, 129, 0.3)',
            background: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.25rem',
            borderRadius: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle size={20} style={{ color: '#10b981' }} />
            <span style={{ color: 'var(--text-primary, #f8fafc)', fontSize: '0.9rem', fontWeight: 600 }}>
              {notification.message}
            </span>
          </div>
          <button
            onClick={() => setNotification(null)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary, #94a3b8)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Main Catalog Data Table Component */}
      <ProductCatalogTable
        key={refreshTrigger}
        onEditProduct={handleEditProduct}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        canEdit={canEdit}
      />

      {/* Registration Modal Dialog */}
      {isRegisterModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(5px)',
            padding: '1rem',
          }}
          className="animate-fade-in"
        >
          <div
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={20} style={{ color: 'var(--accent-primary, #6366f1)' }} />
                <span>Register Product Identity</span>
              </h3>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary, #94a3b8)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <ProductRegistrationForm onSuccess={handleRegisterSuccess} />
          </div>
        </div>
      )}

      {/* Edit Product Slide-Over Panel */}
      <EditProductSlideOver
        product={editingProduct}
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        onSuccess={handleEditSuccess}
        canEdit={canEdit}
      />
    </div>
  );
};
