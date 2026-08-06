# Frontend Specification: Modify Product UI (US-06)

**Feature Branch**: `feature/catalog-us06-us07-management`  
**Created**: 2026-08-06  
**Status**: Draft  
**Input**: User interface for updating existing product information and toggling active status.

---

## User Scenarios & Testing

### User Story 1 - Product Edit Slide-Over / Modal Panel (Priority: P1)

As an authorized catalog manager, I want an intuitive slide-over panel pre-populated with existing product data so that I can edit specific attributes seamlessly without losing page context.

**Why this priority**: Directly surfaces backend modification functionality with premium UX.

**Independent Test**: Click the "Edit" action button on a table row, verify the slide-over opens pre-filled with entity values, change the price, submit, and confirm table data updates automatically.

**Acceptance Scenarios**:

1. **Given** an item in the product catalog table, **When** the user clicks "Edit", **Then** a slide-over panel opens containing all current product attributes.
2. **Given** modified form values, **When** the user clicks "Save Changes", **Then** an API call (`PATCH`) is executed, a success toast notification appears, the panel closes, and the table row updates.
3. **Given** invalid user input (e.g. empty description or non-numeric price), **When** the user attempts submission, **Then** inline validation feedback highlights the offending field and blocks submission.

---

### User Story 2 - Product Status Toggle & Deactivation (Priority: P2)

As a catalog administrator, I want a quick switch or toggle in the edit view to deactivate or reactivate products.

**Why this priority**: Provides rapid management of soft-deleted state.

**Independent Test**: Toggle the active status switch in the edit panel, submit the form, and verify that the product's status badge reflects the update.

**Acceptance Scenarios**:

1. **Given** an active product, **When** the user switches status to "Inactive" and saves, **Then** the product is soft-deleted in the backend and visual badge updates to inactive slate styling.

---

## Requirements

### Functional Requirements

- **FR-001**: UI MUST pre-populate form input state with existing product fields upon opening the panel.
- **FR-002**: UI MUST perform real-time client-side validation for box quantities (`>0`) and exworks price formatting.
- **FR-003**: UI MUST display network loading states on the save button to prevent double submissions.
- **FR-004**: UI MUST adhere to 'Anti-AI Slop' styling principles (Outfit typography, theme CSS variables, subtle glassmorphism, responsive drawer transitions).
