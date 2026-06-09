# Feature Specification: Register Product (US-05)

**Feature Branch**: `US05-register-product`  
**Created**: 2026-06-09  
**Status**: Draft  
**Input**: User description: "Create functionality to register a product in the database with specific attributes and soft-delete capabilities."

## User Scenarios & Testing

### User Story 1 - Create Product with Valid Data (Priority: P1)

As an administrator, I want to register a new product by providing its details so that it becomes part of the active catalog for future forecasting calculations.

**Why this priority**: It is the foundation of the catalog module. Without product creation, inventory tracking and forecasting cannot exist.

**Independent Test**: Submit a payload with a unique code and valid attributes, then check if the record exists in the database and an audit log is written.

**Acceptance Scenarios**:

1. **Given** a unique product code and complete valid data, **When** the admin submits the registration request, **Then** the system persists the product with `is_active=True` and returns a `201 Created` status.
2. **Given** a product payload, **When** the attributes contain negative numbers for quantity or price, **Then** the system rejects the transaction with a `422 Unprocessable Entity` status.

---

### User Story 2 - Prevent Duplicate Product Codes (Priority: P2)

As an administrator, I want the system to reject registrations with existing codes to guarantee data integrity.

**Why this priority**: Prevents identifier collision and data corruption in historical records.

**Independent Test**: Attempt to register a product using a code that already exists in the database and verify the rejection error.

**Acceptance Scenarios**:

1. **Given** an existing product code in the system, **When** the admin attempts to create a new product with that exact same code, **Then** the system aborts the transaction and returns a `400 Bad Request` or `409 Conflict` status with a clear error message.

## Edge Cases

- What happens if a code belongs to a previously "soft-deleted" (inactive) product? (The system should reactivate it or prompt a restoration flow instead of throwing a collision error).
- How are trailing and leading whitespaces in strings handled during sanitization?

## Requirements

### Functional Requirements

- **FR-001**: System MUST enforce a unique constraint on the product `code` attribute.
- **FR-002**: System MUST automatically default the `is_active` attribute to `True` upon instantiation.
- **FR-003**: System MUST validate that `qty_per_box` is a positive integer greater than zero.
- **FR-004**: System MUST validate that `exworks_price` uses a precise Decimal format and is non-negative.
- **FR-005**: System MUST record a `PRODUCT_CREATED` entry in the `audit_logs` table containing the creator's ID and the structural snapshot.

### Key Entities

- **Product**: Represents an item in the catalog. Attributes: `code` (str, unique, indexed), `description` (str), `qty_per_box` (int), `exworks_price` (Decimal), `series` (str), `shipping_route` (str), `is_active` (bool).

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of successfully registered products must instantly propagate an operational event to the `audit_logs` table within the same transaction block.