import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditProductSlideOver } from './EditProductSlideOver';
import { catalogApi } from '../../infrastructure/api/client';
import { ProductResponse } from '../../infrastructure/api/types';

vi.mock('../../infrastructure/api/client', () => ({
  catalogApi: {
    updateProduct: vi.fn(),
  },
  default: {},
}));

const mockProduct: ProductResponse = {
  id: 'prod-uuid-1',
  code: 'EDIT-SKU-100',
  description: 'Original Description',
  qty_per_box: 4,
  exworks_price: '55.00',
  series: 'COMFORT',
  shipping_route: 'MARITIME',
  is_active: true,
  created_at: '2026-08-06T00:00:00Z',
};

describe('EditProductSlideOver Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <EditProductSlideOver
        product={mockProduct}
        isOpen={false}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders pre-populated product attributes when open', () => {
    render(
      <EditProductSlideOver
        product={mockProduct}
        isOpen={true}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByText(/Edit Product/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('EDIT-SKU-100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Original Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
    expect(screen.getByDisplayValue('55.00')).toBeInTheDocument();
  });

  it('dispatches catalogApi.updateProduct and calls onSuccess upon saving changes', async () => {
    const updatedMock: ProductResponse = {
      ...mockProduct,
      description: 'Modified Description',
      exworks_price: '65.00',
    };

    vi.mocked(catalogApi.updateProduct).mockResolvedValueOnce(updatedMock);

    const mockOnSuccess = vi.fn();
    const mockOnClose = vi.fn();

    render(
      <EditProductSlideOver
        product={mockProduct}
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const descInput = screen.getByDisplayValue('Original Description');
    fireEvent.change(descInput, { target: { value: 'Modified Description' } });

    const priceInput = screen.getByDisplayValue('55.00');
    fireEvent.change(priceInput, { target: { value: '65.00' } });

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(catalogApi.updateProduct).toHaveBeenCalledWith('prod-uuid-1', {
        description: 'Modified Description',
        exworks_price: '65.00',
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(updatedMock);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
