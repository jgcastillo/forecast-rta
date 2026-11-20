# Implementation Plan: Consult Catalog UI (US-07)

**Branch**: `feature/catalog-us06-us07-management` | **Date**: 2026-08-06  
**Spec**: `.specify/modules/02_catalog/US07_consult_catalog/frontend/spec.md`

---

## Summary
Develop the catalog table view, search header with debounced state, filter toolbar, pagination controls, and integration hook `useCatalog.ts` connecting to `GET /api/v1/products`.

---

## Technical Context
- **Framework**: React 18+ (Vite)
- **Styling**: Tailwind CSS + Custom Theme CSS Variables
- **Icons & Typography**: Lucide React (Search, Filter, Sliders, ChevronLeft, ChevronRight), Outfit font
- **Testing**: Vitest + React Testing Library (TDD Workflow)

---

## Components & State Architecture

### 1. Network API Extension (`frontend/src/services/catalogApi.ts`)
Add method `getProducts(params?: ProductFilterParams): Promise<PaginatedProductResponse>`:
- Sends `GET` request to `/products` with formatted query params.

### 2. Custom React Hook (`frontend/src/hooks/useCatalog.ts`)
- State: `products`, `total`, `page`, `pageSize`, `totalPages`, `search`, `seriesFilter`, `statusFilter`, `isLoading`, `error`.
- Utilities: Debounced search updater, page change handlers, filter reset logic.

### 3. Component Hierarchy
```text
ProductCatalogContainer.tsx
├── CatalogHeader.tsx           # Title & "Register Product" modal button trigger
├── CatalogFilterBar.tsx        # Search bar (debounced), Series dropdown, Status toggle
├── CatalogTable.tsx            # Data rows, status pills, action dropdowns (Edit trigger US-06)
└── CatalogPagination.tsx       # Page summary, page size selector, prev/next buttons
```

---

## Verification Plan

### Frontend Unit & Integration Tests (`frontend/src/__tests__/CatalogTable.test.tsx`)
- Test rendering product items inside table rows.
- Test debounced search execution updating items list.
- Test pagination control clicks triggering page change API dispatches.
- Test empty state display when query returns no items.
