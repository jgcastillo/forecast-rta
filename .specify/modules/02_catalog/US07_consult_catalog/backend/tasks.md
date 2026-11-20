# Tasks: Consult Catalog Backend (US-07)

## Phase 2: Foundational (Schemas & Query Infrastructure)
- [x] T081 [US-07] Create `ProductFilterParams` and `PaginatedProductResponse` DTO schemas in `src/catalog/infrastructure/api/schemas.py`.

## Phase 3: User Story 1 - Paginated Catalog Retrieval (Priority: P1)
- [x] T082 [P] [US1] Write failing integration tests for paginated product retrieval (`GET /api/v1/products`) in `backend/tests/catalog/test_consult_catalog.py`.
- [x] T083 [US1] Implement `GET /api/v1/products` route with pagination calculation (`offset`, `limit`, `total_pages`).

## Phase 4: User Story 2 - Search & Filter Catalog Items (Priority: P2)
- [x] T084 [P] [US2] Write failing tests for keyword search (code/description) and filter options (`series`, `shipping_route`, `is_active`) in `backend/tests/catalog/test_consult_catalog.py`.
- [x] T085 [US2] Extend query builder logic in `GET /api/v1/products` to apply SQL `ilike` search filters and dynamic status filters.

## Phase 5: User Story 3 - Dynamic Catalog Sorting (Priority: P3)
- [x] T086 [P] [US3] Write failing tests for dynamic sorting by field (`code`, `description`, `exworks_price`) in ascending and descending order.
- [x] T087 [US3] Add sorting clause handler to `GET /api/v1/products` route.
