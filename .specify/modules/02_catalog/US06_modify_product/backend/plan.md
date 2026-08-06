# Implementation Plan: Modify Product Backend (US-06)

**Branch**: `feature/catalog-us06-us07-management` | **Date**: 2026-08-06  
**Spec**: `.specify/modules/02_catalog/US06_modify_product/backend/spec.md`  
**Data Model**: `.specify/modules/02_catalog/data_model.md`

---

## Summary
Implement partial update (`PATCH /api/v1/products/{id}`) functionality for existing product catalog items. The workflow encompasses payload validation with optional fields, SKU uniqueness checks, atomic database persistence, and synchronous audit logging (`PRODUCT_UPDATED` or `PRODUCT_DEACTIVATED`).

---

## Technical Context
- **Language/Version**: Python 3.13 (FastAPI)
- **Dependencies**: SQLModel, Pydantic v2, FastAPI Security Scopes
- **Storage**: PostgreSQL (SQLModel ORM)
- **Testing**: pytest (TDD Protocol)

---

## Architecture & Code Hierarchy

Following Modular Monolith with Hexagonal Architecture guidelines:

```text
backend/src/catalog/
├── domain/
│   └── models.py                   # Product SQLModel entity (Shared Domain)
├── infrastructure/
│   ├── api/
│   │   ├── routes.py               # PATCH /api/v1/products/{id} endpoint
│   │   └── schemas.py              # ProductUpdate Pydantic schema
│   └── db/
│       └── repository.py           # Product database adapter / session ops
```

---

## Components & Specifications

### 1. Pydantic Schema (`src/catalog/infrastructure/api/schemas.py`)
Define `ProductUpdate(SQLModel)` where all attributes are optional:
- `code: Optional[str] = None`
- `description: Optional[str] = None`
- `qty_per_box: Optional[int] = Field(default=None, gt=0)`
- `exworks_price: Optional[Decimal] = Field(default=None, ge=0, max_digits=10, decimal_places=2)`
- `series: Optional[str] = None`
- `shipping_route: Optional[str] = None`
- `is_active: Optional[bool] = None`
- Custom validators: `validate_strings_not_empty` for optional string fields when provided.

### 2. FastAPI Route (`src/catalog/infrastructure/api/routes.py`)
- Endpoint: `PATCH /api/v1/products/{product_id}`
- Security: `Security(get_current_active_user, scopes=["role:analyst"])`
- Workflow:
  1. Fetch `Product` by `product_id`. If not found, raise `404 Not Found`.
  2. If `product_in.code` is provided and differs from `existing.code`:
     - Query DB for `code`. If match found, raise `409 Conflict`.
  3. Compute delta dictionary of updated fields for `AuditLog.details`.
  4. Apply set values to entity instance.
  5. If `is_active` changed from `True` to `False`, set audit action to `"PRODUCT_DEACTIVATED"`, otherwise `"PRODUCT_UPDATED"`.
  6. Add entity and `AuditLog` to session, commit atomically, refresh, and return `ProductResponse`.

---

## Verification Plan

### Automated Integration Tests (`backend/tests/catalog/test_modify_product.py`)
- `test_update_product_success`: Modify price and description; verify updated state and audit log entry.
- `test_update_product_code_duplicate`: Attempt to update SKU to an existing code; verify `409 Conflict`.
- `test_update_product_invalid_values`: Send `qty_per_box=0` or negative price; verify `422 Unprocessable Entity`.
- `test_deactivate_product`: Set `is_active=False`; verify status update and `PRODUCT_DEACTIVATED` audit log.
- `test_update_nonexistent_product`: Send random UUID; verify `404 Not Found`.
- `test_update_product_unauthorized`: Request without proper RBAC scope; verify `403 Forbidden`.
