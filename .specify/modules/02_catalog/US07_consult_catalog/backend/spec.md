# Feature Specification: Consult Catalog Backend (US-07)

**Feature Branch**: `feature/catalog-us06-us07-management`  
**Created**: 2026-08-06  
**Status**: Draft  
**Input**: User story US-07: Query, search, filter, and paginate catalog items.

---

## User Scenarios & Testing

### User Story 1 - Paginated Catalog Retrieval (Priority: P1)

As an authenticated user (Admin, Analyst, or Reviewer), I want to retrieve a paginated list of catalog products so that I can browse items efficiently without overloading system resources.

**Why this priority**: Core retrieval mechanism for all user roles across the platform.

**Independent Test**: Request `GET /api/v1/products?page=1&page_size=10`, verify response includes metadata (`total`, `page`, `page_size`, `total_pages`) and 10 items.

**Acceptance Scenarios**:

1. **Given** catalog products in the database, **When** any authenticated user requests the product list, **Then** the system returns `200 OK` with paginated records and metadata.
2. **Given** an invalid pagination parameter (`page < 1` or `page_size < 1`), **When** the query is sent, **Then** the system responds with `422 Unprocessable Entity`.

---

### User Story 2 - Search & Filter Catalog Items (Priority: P2)

As a supply chain analyst, I want to search products by keyword (code or description) and filter by series, shipping route, or active status so that I can quickly locate specific products.

**Why this priority**: Essential for managing large product catalogs during forecast reviews.

**Independent Test**: Send query `GET /api/v1/products?search=DESK&series=OFFICE&is_active=true` and assert that only active products in the "OFFICE" series matching "DESK" are returned.

**Acceptance Scenarios**:

1. **Given** catalog items, **When** a user provides a `search` string, **Then** the system performs case-insensitive partial matching against `code` OR `description`.
2. **Given** catalog items, **When** a user filters by `is_active=false`, **Then** the system returns soft-deleted products exclusively.
3. **Given** catalog items, **When** `is_active` filter is omitted, **Then** the system defaults to returning active products (`is_active=true`).

---

### User Story 3 - Dynamic Catalog Sorting (Priority: P3)

As an analyst, I want to sort catalog products by code, description, price, or creation date in ascending or descending order.

**Why this priority**: Helps organize inventory views for reporting and verification.

**Independent Test**: Request `GET /api/v1/products?sort_by=exworks_price&sort_order=desc`, verify items are returned in descending price order.

**Acceptance Scenarios**:

1. **Given** catalog products, **When** a user specifies `sort_by=code` and `sort_order=asc`, **Then** items are ordered alphabetically by SKU code.

---

## Edge Cases

- What happens if the search term yields zero matching items? (The system MUST return `200 OK` with an empty `items: []` array and `total: 0`).
- How does the system handle SQL injection attempts in search queries? (The system MUST use parameterized SQLModel queries to sanitize all text parameters).

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a `GET /api/v1/products` endpoint supporting pagination parameters (`page: int = 1`, `page_size: int = 20`).
- **FR-002**: System MUST support case-insensitive keyword filtering (`search`) matching `code` or `description`.
- **FR-003**: System MUST support exact match filtering on `series`, `shipping_route`, and boolean `is_active`.
- **FR-004**: System MUST allow dynamic sorting (`sort_by` fields: `code`, `description`, `exworks_price`, `created_at`; `sort_order`: `asc` or `desc`).
- **FR-005**: System MUST allow access to all authenticated roles (`Admin`, `Analyst`, `Reviewer`).

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of query responses include complete pagination metadata.
- **SC-002**: Search requests execute in under 100ms for catalogs up to 10,000 items.
