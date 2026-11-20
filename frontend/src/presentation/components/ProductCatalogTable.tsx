import React from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Package,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  XCircle,
  Plus
} from 'lucide-react';
import { useProductCatalog } from '../../application/hooks/useProductCatalog';
import { ProductResponse } from '../../infrastructure/api/types';

interface ProductCatalogTableProps {
  onEditProduct: (product: ProductResponse) => void;
  onOpenRegisterModal?: () => void;
  canEdit?: boolean;
}

export const ProductCatalogTable: React.FC<ProductCatalogTableProps> = ({
  onEditProduct,
  onOpenRegisterModal,
  canEdit = true,
}) => {
  const {
    products,
    total,
    page,
    pageSize,
    totalPages,
    search,
    setSearch,
    series,
    setSeries,
    shippingRoute,
    setShippingRoute,
    isActive,
    setIsActive,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    setPage,
    setPageSize,
    isLoading,
    error,
  } = useProductCatalog(10);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
    }
    return sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  const startRecord = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, total);

  return (
    <div className="glass-card" style={{ width: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header & Main Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.35rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={22} style={{ color: 'var(--accent-primary, #6366f1)' }} />
            <span>Product Catalog</span>
          </h3>
          <p style={{ color: 'var(--text-secondary, #94a3b8)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
            Manage active SKUs, product pricing, packaging rules, and inventory attributes.
          </p>
        </div>

        {onOpenRegisterModal && canEdit && (
          <button
            onClick={onOpenRegisterModal}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} />
            <span>Register Product</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          borderRadius: 'var(--radius-md, 8px)',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary, #94a3b8)',
            }}
          />
          <input
            type="text"
            placeholder="Search code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ width: '100%', paddingLeft: '2.25rem', paddingRight: search ? '2rem' : '0.75rem' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary, #94a3b8)',
                cursor: 'pointer',
              }}
            >
              <XCircle size={14} />
            </button>
          )}
        </div>

        {/* Series Filter */}
        <div style={{ minWidth: '130px' }}>
          <select
            value={series}
            onChange={(e) => { setSeries(e.target.value); setPage(1); }}
            className="input-field"
            style={{ width: '100%', fontSize: '0.85rem' }}
          >
            <option value="">All Series</option>
            <option value="COMFORT">COMFORT</option>
            <option value="OFFICE">OFFICE</option>
            <option value="HOME">HOME</option>
            <option value="GAMING">GAMING</option>
            <option value="LEGACY">LEGACY</option>
          </select>
        </div>

        {/* Route Filter */}
        <div style={{ minWidth: '140px' }}>
          <select
            value={shippingRoute}
            onChange={(e) => { setShippingRoute(e.target.value); setPage(1); }}
            className="input-field"
            style={{ width: '100%', fontSize: '0.85rem' }}
          >
            <option value="">All Routes</option>
            <option value="MARITIME">MARITIME</option>
            <option value="AIR">AIR</option>
            <option value="LAND">LAND</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ minWidth: '140px' }}>
          <select
            value={isActive === undefined ? 'all' : isActive ? 'true' : 'false'}
            onChange={(e) => {
              const val = e.target.value;
              setIsActive(val === 'all' ? undefined : val === 'true');
              setPage(1);
            }}
            className="input-field"
            style={{ width: '100%', fontSize: '0.85rem' }}
          >
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
            <option value="all">All Statuses</option>
          </select>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            fontSize: '0.85rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Data Table */}
      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <th
                onClick={() => handleSort('code')}
                style={{ padding: '0.85rem 1rem', cursor: 'pointer', fontWeight: 600, userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>SKU Code</span>
                  {renderSortIcon('code')}
                </div>
              </th>
              <th
                onClick={() => handleSort('description')}
                style={{ padding: '0.85rem 1rem', cursor: 'pointer', fontWeight: 600, userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Description</span>
                  {renderSortIcon('description')}
                </div>
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Box Qty</th>
              <th
                onClick={() => handleSort('exworks_price')}
                style={{ padding: '0.85rem 1rem', cursor: 'pointer', fontWeight: 600, userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Price (USD)</span>
                  {renderSortIcon('exworks_price')}
                </div>
              </th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Series</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Route</th>
              <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 600 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)' }}>
                  Loading catalog products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary, #94a3b8)' }}>
                  No catalog products found matching search criteria.
                </td>
              </tr>
            ) : (
              products.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    transition: 'background 0.15s ease',
                  }}
                  className="table-row-hover"
                >
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-primary, #6366f1)' }}>
                    {item.code}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-primary, #f8fafc)' }}>
                    {item.description}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>{item.qty_per_box}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>${item.exworks_price}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      {item.series}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary, #94a3b8)' }}>
                    {item.shipping_route}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        background: item.is_active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                        color: item.is_active ? '#10b981' : '#94a3b8',
                        border: `1px solid ${item.is_active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`,
                      }}
                    >
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => onEditProduct(item)}
                      style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        color: 'var(--accent-primary, #6366f1)',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.8rem',
                      }}
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary, #94a3b8)',
        }}
      >
        <div>
          Showing <strong>{startRecord}</strong> to <strong>{endRecord}</strong> of <strong>{total}</strong> products
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Page Size Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="input-field"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Prev/Next Page Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1 || isLoading}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
            >
              <ChevronLeft size={16} />
            </button>

            <span style={{ padding: '0 0.4rem', fontWeight: 600, color: 'var(--text-primary, #f8fafc)' }}>
              Page {page} of {totalPages || 1}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages || isLoading}
              className="btn btn-secondary"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
