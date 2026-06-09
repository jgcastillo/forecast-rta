# Tasks: Register Product Backend (US-05)

## Phase 2: Foundational (Blocking Prerequisites)
- [x] T061 Create the `Product` database model using `SQLModel` with appropriate constraints in `src/catalog/domain/models.py`.
- [x] T062 Generate and execute the Alembic database migration file to apply the new `products` table schema.

## Phase 3: User Story 1 - Create Product with Valid Data (Priority: P1)
- [x] T063 [P] [US1] Write failing integration tests for successful product registration in `backend/tests/catalog/test_register_product.py`.
- [x] T064 [US1] Create the Pydantic input validation schema `ProductCreate` in `src/catalog/infrastructure/api/schemas.py`.
- [x] T065 [US1] Implement the `POST /api/v1/products` endpoint handling atomic session commits for both `Product` and `AuditLog`.

## Phase 4: User Story 2 - Prevent Duplicate Product Codes (Priority: P2)
- [x] T066 [P] [US2] Write a failing test asserting collision rejection when duplicate product codes are supplied.
- [x] T067 [US2] Add database lookups inside the creation pipeline to catch unique constraint violations early and raise proper exceptions.