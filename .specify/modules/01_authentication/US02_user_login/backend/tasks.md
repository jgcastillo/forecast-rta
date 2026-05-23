# Tasks Checklist: User Login Backend (US-02)

## Phase 1: Unit Testing & Security Utilities
- [x] T025: Create unit test inside `tests/auth/unit/test_security.py` to verify JWT creation and token expiration claims.
- [x] T026: Implement `create_access_token(data: dict)` utility function making the tests green.
- [x] T027: Write unit test to verify verification of raw passwords against correct/incorrect bcrypt hashes.

## Phase 2: Router Implementation & Integration
- [x] T028: Create integration test inside `tests/auth/integration/test_login_api.py` asserting 200 OK on correct login and 401 on bad credentials.
- [x] T029: Implement the `/api/v1/auth/login` endpoint using FastAPI's `OAuth2PasswordRequestForm`.
- [x] T030: Update the User Registration endpoint (`US-01`) security dependency to extract and validate the newly generated real token, replacing previous mocks.