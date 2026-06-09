import React, { useState } from 'react';
import { Package, ShieldAlert, Circle, HelpCircle } from 'lucide-react';
import { ProductRegistrationForm } from './ProductRegistrationForm';
import { ProductResponse } from '../../infrastructure/api/types';

export const ProductCatalogContainer: React.FC = () => {
  const [lastRegisteredProduct, setLastRegisteredProduct] = useState<ProductResponse | null>(null);

  const handleRegisterSuccess = (newProduct: ProductResponse) => {
    setLastRegisteredProduct(newProduct);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)',
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}
        className="brand-logo"
        >
          <Package size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Product Catalog</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Register and configure inventory assets for automated supply-chain demand forecasting.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', alignItems: 'start' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Register Product Identity</span>
            </h3>
            <ProductRegistrationForm onSuccess={handleRegisterSuccess} />
          </div>
        </div>

        {/* Success Details Block */}
        {lastRegisteredProduct && (
          <div 
            className="glass-card animate-slide-down" 
            style={{ 
              maxWidth: '600px',
              margin: '0 auto',
              width: '100%',
              borderColor: 'rgba(16, 185, 129, 0.3)',
              background: 'rgba(16, 185, 129, 0.05)',
              display: 'flex',
              gap: '1rem',
              padding: '1.5rem'
            }}
          >
            <Circle size={24} style={{ fill: 'var(--success)', color: 'var(--success)', flexShrink: 0 }} />
            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Catalog Entry Created</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                Product code <strong>{lastRegisteredProduct.code}</strong> has been successfully registered. 
                Description: <em>{lastRegisteredProduct.description}</em>. 
                Audit ledger transaction verified.
              </p>
            </div>
          </div>
        )}

        {/* Catalog Help Block */}
        <div 
          style={{ 
            maxWidth: '600px',
            margin: '0 auto',
            width: '100%',
            display: 'flex', 
            gap: '0.75rem', 
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(99, 102, 241, 0.05)',
            border: '1px solid rgba(99, 102, 241, 0.15)'
          }}
        >
          <HelpCircle size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>
            <strong>Catalog Guidelines:</strong> Enforce unique code structures. The exworks price
            and quantity values must be formatted precisely. These values are used reactively in 
            subsequent average lead-time math.
          </p>
        </div>
      </div>
    </div>
  );
};
