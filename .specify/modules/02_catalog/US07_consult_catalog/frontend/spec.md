# Frontend Specification: Consult Catalog UI (US-07)

**Feature Branch**: `feature/catalog-us06-us07-management`  
**Created**: 2026-08-06  
**Status**: Draft  
**Input**: User interface for consulting, searching, filtering, and navigating the product catalog table.

---

## User Scenarios & Testing

### User Story 1 - Product Catalog Table & Pagination (Priority: P1)

As an authenticated user, I want to view products in a clean data table with pagination controls so that I can browse through inventory catalog entries smoothly.

**Why this priority**: Core view for catalog interaction and product management workflows.

**Independent Test**: Load the product catalog page, verify data table renders products with appropriate columns (Code, Description, Box Qty, Price, Series, Route, Status, Actions), and test pagination button navigation.

**Acceptance Scenarios**:

1. **Given** products exist in the catalog, **When** the user accesses the catalog page, **Then** a data table displays product rows and pagination controls (Current Page, Total Pages, Next/Previous buttons).
2. **Given** page 1 is displayed, **When** the user clicks "Next Page", **Then** page 2 data is fetched and displayed seamlessly.

---

### User Story 2 - Real-Time Search & Filtering Controls (Priority: P2)

As a user, I want a search bar with real-time debouncing and filter dropdowns (Series, Status) so that I can locate products rapidly without full page reloads.

**Why this priority**: Dramatically enhances user productivity when navigating thousands of catalog entries.

**Independent Test**: Type a SKU code into the search bar, verify search is debounced (300ms), and table automatically updates with filtered results.

**Acceptance Scenarios**:

1. **Given** the search input, **When** the user types "DESK", **Then** the request is debounced and results filtering by "DESK" are rendered.
2. **Given** status filter dropdown, **When** the user selects "Inactive", **Then** soft-deleted products are rendered.

---

## Requirements

### Functional Requirements

- **FR-001**: UI MUST render a catalog data table complying with Anti-AI Slop design rules (Outfit font headers, distinct status badges, hover highlights, glassmorphism containers).
- **FR-002**: UI MUST debounce search input queries by 300ms to minimize network requests.
- **FR-003**: UI MUST provide filter controls for product series and active status.
- **FR-004**: UI MUST present loading skeleton states during data fetches.
