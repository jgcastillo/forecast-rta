# Feature Specification: Modify Product Backend (US-06)

**Feature Branch**: `feature/catalog-us06-us07-management`  
**Created**: 2026-08-06  
**Status**: Draft  
**Input**: User story US-06: Modify existing catalog products and soft-delete/deactivate product entries.

---

## User Scenarios & Testing

### User Story 1 - Partial Update of Product Attributes (Priority: P1)

As an authorized user (Admin or Analyst), I want to update specific fields of an existing product (such as description, box quantity, price, series, or shipping route) so that the catalog stays accurate without re-entering unchanged data.

**Why this priority**: Products frequently undergo price adjustments, packaging changes, or route updates. Full resource replacements can accidentally overwrite unchanged attributes.

**Independent Test**: Send a `PATCH` payload modifying only `exworks_price` and `qty_per_box` for a target product ID, then verify that the target attributes are updated, unspecified fields remain untouched, and a `PRODUCT_UPDATED` entry is created in `audit_logs`.

**Acceptance Scenarios**:

1. **Given** an existing active product, **When** an authorized user submits a partial update payload with valid values, **Then** the system updates only the specified attributes, leaves existing values unchanged, and returns `200 OK` with the updated product model.
2. **Given** an update request, **When** the payload attempts to set invalid values (`qty_per_box <= 0` or negative `exworks_price`), **Then** the system rejects the transaction with `422 Unprocessable Entity`.
3. **Given** a non-existent product ID, **When** an update request is received, **Then** the system returns `404 Not Found`.

---

### User Story 2 - Product Code Update & Uniqueness Enforcement (Priority: P2)

As an administrator, I want to modify a product's SKU code while ensuring it does not collide with any other existing product code.

**Why this priority**: SKU codes may change due to supplier rebrandings or internal taxonomy shifts, but code uniqueness must be strictly preserved.

**Independent Test**: Attempt to update product A's code to match product B's existing code and verify that a collision error is returned.

**Acceptance Scenarios**:

1. **Given** product A and product B, **When** the user attempts to update product A's code to product B's code, **Then** the system aborts the operation and returns `409 Conflict`.
2. **Given** product A, **When** the user submits an update payload containing product A's current code without changes, **Then** the system accepts the update without raising a collision error.

---

### User Story 3 - Product Soft Deletion / Deactivation (Priority: P3)

As an administrator, I want to deactivate (soft-delete) a product so that it is marked inactive and excluded from active forecasting without losing historical context.

**Why this priority**: Deleting catalog items directly destroys historical sales references used by the forecasting engine. Soft deletion preserves database references while updating status.

**Independent Test**: Send an update payload with `is_active=False` or trigger the deactivation endpoint, then verify `is_active` becomes `False` and a `PRODUCT_DEACTIVATED` event is logged.

**Acceptance Scenarios**:

1. **Given** an active product, **When** an authorized user updates `is_active` to `False`, **Then** the product status becomes inactive, and an audit log with action `PRODUCT_DEACTIVATED` is created in the same transaction.

---

## Edge Cases

- What happens if a user submits an update with empty strings or whitespace-only strings for text fields (`description`, `series`, `shipping_route`)? (The system MUST reject empty string inputs with `422 Unprocessable Entity`).
- What happens if an update attempt is made on a soft-deleted product? (The system MUST allow updating attributes or setting `is_active=True` to reactivate).

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a HTTP `PATCH` endpoint at `/api/v1/products/{id}` accepting partial product update payloads.
- **FR-002**: System MUST validate that string attributes (`code`, `description`, `series`, `shipping_route`) are stripped of leading/trailing whitespace and cannot be empty.
- **FR-003**: System MUST enforce that `qty_per_box` is greater than zero and `exworks_price` is non-negative with two decimal places.
- **FR-004**: System MUST check SKU code uniqueness when `code` is present in the update payload and differs from the current entity's code.
- **FR-005**: System MUST record an `AuditLog` entry detailing changed fields (`PRODUCT_UPDATED` or `PRODUCT_DEACTIVATED`) in the same database transaction.
- **FR-006**: System MUST restrict modification privileges strictly to users holding the `role:analyst` or `Admin` security scopes.

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of product modifications persist changes atomically alongside audit trails.
- **SC-002**: 0% duplicate code collisions allowed across all update transactions.
