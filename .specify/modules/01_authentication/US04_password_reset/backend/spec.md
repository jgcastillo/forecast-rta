# Feature Specification: Password Reset (US-04)

**Feature Branch**: `US04-password-reset`  
**Created**: 2026-06-02  
**Status**: Draft  
**Input**: User description: "Implement password reset flow using single-use tokens"

## User Scenarios & Testing

### User Story 1 - Request Password Reset (Priority: P1)

The user requests a password reset by providing their email address. The system generates a temporary, secure reset link.

**Why this priority**: It is the primary gateway for account recovery. Critical for security and user support.

**Independent Test**: Provide a registered email and verify the reset link appears in the terminal logs.

**Acceptance Scenarios**:

1. **Given** a registered email, **When** the user requests a reset, **Then** the system returns "OK" and logs the recovery link to the terminal.
2. **Given** an unregistered email, **When** the user requests a reset, **Then** the system returns "OK" (to prevent email enumeration attacks).

---

### User Story 2 - Execute Password Reset (Priority: P2)

The user accesses the link, validates the token, and sets a new password.

**Why this priority**: It is the final step to fulfill the recovery journey.

**Independent Test**: Use the generated token, submit a new password, and verify login with the new credentials.

**Acceptance Scenarios**:

1. **Given** a valid token, **When** the user submits a new password, **Then** the password is updated and the token is invalidated.
2. **Given** an expired/invalid token, **When** the user attempts to reset, **Then** the system returns a 401 error.

## Edge Cases

- What happens if the user requests multiple links within the 15-minute window?
- How does the system handle tokens that are manipulated or incorrectly signed?

## Requirements

### Functional Requirements

- **FR-001**: System MUST generate JWT tokens with `password_reset` scope.
- **FR-002**: System MUST validate token expiration (15 minutes).
- **FR-003**: System MUST hash new passwords using Bcrypt.
- **FR-004**: System MUST record `PASSWORD_RESET` action in `audit_logs` table.

### Key Entities

- **ResetToken**: Short-lived JWT linked to the User ID.
- **AuditLog**: Record of the reset action with a timestamp.

## Success Criteria

### Measurable Outcomes

- **SC-001**: The recovery flow (request + change) must be completed in under 2 minutes.
- **SC-002**: 100% of reset requests must generate an audit log entry.