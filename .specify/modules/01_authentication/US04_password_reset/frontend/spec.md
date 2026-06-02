# Frontend Specification: Password Reset UI (US-04)

**Feature Branch**: `US04-password-reset`  
**Created**: 2026-06-02  
**Status**: Draft  
**Input**: User description: "Implement password reset UI with theme support"

## User Scenarios & Testing

### User Story 1 - Forgot Password View (Priority: P1)

The user provides their email to initiate the reset process.

**Why this priority**: Required for the recovery entry point.

**Independent Test**: Navigate to `/forgot-password`, input a valid email, and confirm the success state is reached.

**Acceptance Scenarios**:

1. **Given** the forgot-password page, **When** user submits email, **Then** show a confirmation message ("Check your terminal/email").

---

### User Story 2 - Reset Password Form (Priority: P2)

The user uses the token from the URL to set a new password.

**Why this priority**: Completes the recovery journey.

**Independent Test**: Simulate URL with `?token=...`, input new password, and verify API success.

**Acceptance Scenarios**:

1. **Given** reset-password view with token, **When** submitting matching passwords, **Then** redirect to login on success.
2. **Given** invalid token, **When** submitting, **Then** show error UI ("Invalid or expired token").

## Requirements

### Functional Requirements

- **FR-001**: UI MUST use the `ThemeToggle` context to support Light/Dark modes.
- **FR-002**: Password fields MUST include matching validation before submission.
- **FR-003**: UI MUST leverage the central API client with proper error mapping.
- **FR-004**: Design MUST follow 'Anti-AI Slop' principles (distinct typography, cohesive CSS variables, generous negative space).

## Success Criteria

- **SC-001**: All public auth routes (`/forgot-password`, `/reset-password`) must match the visual identity of the Login view.