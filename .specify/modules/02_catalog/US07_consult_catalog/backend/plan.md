# Implementation Plan: Consult Catalog Backend (US-07)

**Branch**: `feature/catalog-us06-us07-management` | **Date**: 2026-08-06  
**Spec**: `.specify/modules/02_catalog/US07_consult_catalog/backend/spec.md`  
**Data Model**: `.specify/modules/02_catalog/data_model.md`

---

## Summary
Implement catalog consultation, search, dynamic filtering, and pagination backend API (`GET /api/v1/products`). Supports keyword search across product codes and descriptions, filtering by series/route/status, dynamic field sorting, and pagination metadata wrappers.

---

## Technical Context
- **Language/Version**: Python 3.13 (FastAPI)
- **Dependencies**: SQLModel, Pydantic v2
- **Storage**: PostgreSQL (SQLModel ORM)
- **Testing**: pytest (TDD Protocol)

---

## Architecture & Code Hierarchy

```text
backend/src/catalog/
├── domain/
│   └── models.py                   # Product entity
├── infrastructure/
│   ├── api/
│   │   ├── routes.py               # GET /api/v1/products endpoint
│   │   └── schemas.py              # ProductFilterParams, PaginatedProductResponse
```

---

## Components & Specifications

### 1. Pydantic Query DTOs (`src/catalog/infrastructure/api/schemas.py`)
- **`ProductFilterParams`**:
  - `search: Optional[str] = None`
  - `series: Optional[str] = None`
  - `shipping_route: Optional[str] = None`
  - `is_active: Optional[bool] = True`
  - `page: int = Field(default=1, ge=1)`
  - `page_size: int = Field(default=20, ge=1, le=100)`
  - `sort_by: str = Field(default="code")` (Allowed: `code`, `description`, `exworks_price`, `created_at`)
  - `sort_order: str = Field(default="asc")` (Allowed: `asc`, `desc`)

- **`PaginatedProductResponse`**:
  - `items: List[ProductResponse]`
  - `total: int`
  - `page: int`
  - `page_size: int`
  - `total_pages: int`

### 2. FastAPI Route (`src/catalog/infrastructure/api/routes.py`)
- Endpoint: `GET /api/v1/products`
- Security: `Security(get_current_active_user, scopes=["role:reviewer"])` (accessible to Admin, Analyst, Reviewer).
- Logic:
  1. Construct base SQLModel query `select(Product)`.
  2. If `search`: add `.where(or_(Product.code.ilike(f"%{search}%"), Product.description.ilike(f"%{search}%")))`.
  3. If `series`: add `.where(Product.series == series)`.
  4. If `shipping_route`: add `.where(Product.shipping_route == shipping_route)`.
  5. If `is_active is not None`: add `.where(Product.is_active == is_active)`.
  6. Execute count query for `total`.
  7. Apply sorting (`asc`/`desc`) and pagination (`offset((page - 1) * page_size).limit(page_size)`).
  8. Calculate `total_pages` and return `PaginatedProductResponse`.

---

## Verification Plan

### Automated Integration Tests (`backend/tests/catalog/test_consult_catalog.py`)
- `test_get_products_paginated`: Verify pagination limits and metadata calculation.
- `test_get_products_search_keyword`: Search by partial SKU code and description substring.
- `test_get_products_filter_status`: Filter by `is_active=False` and `is_active=True`.
- `test_get_products_sorting`: Verify price sorting ascending and descending.
- `test_get_products_unauthenticated`: Request without token returns `401 Unauthorized`.
