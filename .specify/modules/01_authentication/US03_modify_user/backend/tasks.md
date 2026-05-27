# Tasks Checklist: Modify User Backend (US-03)

## Phase 1: Schemas & Database Testing
- [ ] T037: Define `UserUpdate` schema allowing partial updates (Optional fields).
- [ ] T038: Write integration tests for the PATCH endpoint ensuring 200 OK (valid update), 404 (not found), and 403 (unauthorized/non-admin).

## Phase 2: Implementation
- [ ] T039: Implement repository logic to apply `.model_dump(exclude_unset=True)` to the existing user record.
- [ ] T040: Implement the atomic transaction to save the User modifications and insert the `USER_UPDATED` event into `audit_logs`.
- [ ] T041: Implement the `/api/v1/users/{user_id}` endpoint in the router.