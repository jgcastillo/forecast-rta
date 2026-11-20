import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductCatalogTable } from './ProductCatalogTable';
import { catalogApi } from '../../infrastructure/api/client';
import { PaginatedProductResponse } from '../../infrastructure/api/types';

vi.mock('../../infrastructure/api/client', () => ({
  catalogApi: {
    getProducts: vi.fn(),
    updateProduct: vi.fn(),
  },
  default: {},
}));

const mockPaginatedResponse: PaginatedProductResponse = {
  items: [
    {
      id: 'prod-1',
      code: 'TEST-SKU-01',
      description: 'Ergonomic Desk Chair',
      qty_per_box: 4,
      exworks_price: '49.99',
      series: 'COMFORT',
      shipping_route: 'MARITIME',
      is_active: true,
      created_at: '2026-08-06T00:00:00Z',
    },
    {
      id: 'prod-2',
      code: 'TEST-SKU-02',
      description: 'Office Table Wood',
      qty_per_box: 1,
      exworks_price: '120.00',
      series: 'OFFICE',
      shipping_route: 'AIR',
      is_active: false,
      created_at: '2026-08-06T01:00:00Z',
    },
  ],
  total: 2,
  page: 1,
  page_size: 10,
  total_pages: 1,
};

describe('ProductCatalogTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table columns, search input, and filter controls', async () => {
    vi.mocked(catalogApi.getProducts).mockResolvedValueOnce(mockPaginatedResponse);

    render(<ProductCatalogTable onEditProduct={vi.fn()} />);

    expect(screen.getByPlaceholderText(/Search code or description.../i)).toBeInTheDocument();
    expect(screen.getByText(/SKU Code/i)).toBeInTheDocument();
    expect(screen.getByText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Price \(USD\)/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('TEST-SKU-01')).toBeInTheDocument();
      expect(screen.getByText('Ergonomic Desk Chair')).toBeInTheDocument();
      expect(screen.getByText('TEST-SKU-02')).toBeInTheDocument();
    });
  });

  it('calls onEditProduct callback when edit button is clicked', async () => {
    vi.mocked(catalogApi.getProducts).mockResolvedValueOnce(mockPaginatedResponse);
    const mockOnEdit = vi.fn();

    render(<ProductCatalogTable onEditProduct={mockOnEdit} />);

    await waitFor(() => {
      expect(screen.getByText('TEST-SKU-01')).toBeInTheDocument();
    });

    const editBtns = screen.getAllByRole('button', { name: /Edit/i });
    fireEvent.click(editBtns[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockPaginatedResponse.items[0]);
  });

  it('triggers debounced search query when user types in search bar', async () => {
    vi.mocked(catalogApi.getProducts).mockResolvedValue(mockPaginatedResponse);

    render(<ProductCatalogTable onEditProduct={vi.fn()} />);

    const searchInput = screen.getByPlaceholderText(/Search code or description.../i);
    fireEvent.change(searchInput, { target: { value: 'Desk' } });

    await waitFor(
      () => {
        expect(catalogApi.getProducts).toHaveBeenCalledWith(
          expect.objectContaining({ search: 'Desk' })
        );
      },
      { timeout: 1000 }
    );
  });
});
