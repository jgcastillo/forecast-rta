# Tasks: Modify Product Backend (US-06)

## Phase 2: Foundational (Schemas & Test Infrastructure)
- [x] T068 [US-06] Create `ProductUpdate` validation schema with optional fields and string trimming validators in `src/catalog/infrastructure/api/schemas.py`.

## Phase 3: User Story 1 - Partial Update of Product Attributes (Priority: P1)
- [x] T069 [P] [US1] Write failing integration tests for partial product modification (`PATCH /api/v1/products/{id}`) in `backend/tests/catalog/test_modify_product.py`.
- [x] T070 [US1] Implement `PATCH /api/v1/products/{id}` route handling entity lookup, delta updates, and atomic commit of updated `Product` and `AuditLog` (`PRODUCT_UPDATED`).

## Phase 4: User Story 2 - Product Code Update & Uniqueness Enforcement (Priority: P2)
- [x] T071 [P] [US2] Write a failing test for duplicate product code collision on update in `backend/tests/catalog/test_modify_product.py`.
- [x] T072 [US2] Add duplicate SKU validation logic inside the `PATCH` endpoint to return `409 Conflict` when a target code already exists for another product.

## Phase 5: User Story 3 - Product Soft Deletion / Deactivation (Priority: P3)
- [x] T073 [P] [US3] Write a failing test for product soft deletion (`is_active=False`) and audit logging in `backend/tests/catalog/test_modify_product.py`.
- [x] T074 [US3] Implement status change tracking to record `PRODUCT_DEACTIVATED` audit log entries when products are marked inactive.
