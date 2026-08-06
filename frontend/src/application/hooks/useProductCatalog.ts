import { useState, useEffect, useCallback, useRef } from 'react';
import { catalogApi } from '../../infrastructure/api/client';
import { ProductResponse, ProductFilterParams } from '../../infrastructure/api/types';

export interface UseProductCatalogReturn {
  products: ProductResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  setSearch: (s: string) => void;
  series: string;
  setSeries: (s: string) => void;
  shippingRoute: string;
  setShippingRoute: (r: string) => void;
  isActive: boolean | undefined;
  setIsActive: (active: boolean | undefined) => void;
  sortBy: string;
  setSortBy: (field: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  setPage: (p: number) => void;
  setPageSize: (size: number) => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProductCatalog = (initialPageSize: number = 10): UseProductCatalogReturn => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [series, setSeries] = useState<string>('');
  const [shippingRoute, setShippingRoute] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean | undefined>(true);
  const [sortBy, setSortBy] = useState<string>('code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: ProductFilterParams = {
        page,
        page_size: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (series) {
        params.series = series;
      }
      if (shippingRoute) {
        params.shipping_route = shippingRoute;
      }
      if (isActive !== undefined) {
        params.is_active = isActive;
      }

      const response = await catalogApi.getProducts(params);
      setProducts(response.items);
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || 'Failed to fetch catalog products';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, debouncedSearch, series, shippingRoute, isActive, sortBy, sortOrder]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return {
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
    refetch: fetchCatalog,
  };
};
