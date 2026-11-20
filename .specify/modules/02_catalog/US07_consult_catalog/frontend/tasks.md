# Tasks: Consult Catalog UI (US-07)

## Phase 2: Foundational (API Client & Hooks)
- [x] T088 [US-07] Add `getProducts` network query contract to `catalogApi` and declare `ProductFilterParams` and `PaginatedProductResponse` interfaces in frontend types.

## Phase 3: User Story 1 - Product Catalog Table & Pagination (Priority: P1)
- [x] T089 [P] [US1] Write failing Vitest tests for catalog table rendering and pagination interactions in `frontend/src/presentation/components/ProductCatalogTable.test.tsx`.
- [x] T090 [US1] Create custom state hook `useProductCatalog.ts` managing query parameters, data fetching, and pagination handlers.
- [x] T091 [US1] Build `ProductCatalogTable.tsx` component with Anti-AI Slop aesthetics (Outfit display headers, status badges, slate hover rows).

## Phase 4: User Story 2 - Real-Time Search & Filtering Controls (Priority: P2)
- [x] T092 [P] [US2] Write failing tests for debounced search bar and filter controls in `frontend/src/presentation/components/ProductCatalogTable.test.tsx`.
- [x] T093 [US2] Build filter toolbar featuring 300ms debounced search input, series dropdown, shipping route dropdown, and active/inactive status filter.
- [x] T094 [US2] Integrate `ProductCatalogTable`, modal dialog, and `EditProductSlideOver` into `ProductCatalogContainer.tsx`.
