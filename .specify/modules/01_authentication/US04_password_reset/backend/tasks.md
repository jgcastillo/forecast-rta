# Tasks: Password Reset (US-04)

## Phase 2: Foundational (Blocking Prerequisites)
- [x] T048 Implement `create_password_reset_token` in `src/auth/security.py`
- [x] T049 Implement `verify_password_reset_token` in `src/auth/security.py`

## Phase 3: User Story 1 - Request Password Reset (Priority: P1)
- [x] T050 [US1] Implement `POST /api/v1/auth/password-recovery/{email}`
- [x] T051 [US1] Implement terminal console logger for recovery link (Dev Mode)

## Phase 4: User Story 2 - Execute Password Reset (Priority: P2)
- [x] T052 [US2] Implement `POST /api/v1/auth/reset-password`
- [x] T053 [US2] Implement atomic database update with SQLModel and `audit_logs`
- [x] T054 [US2] Write integration tests for token expiration and validity