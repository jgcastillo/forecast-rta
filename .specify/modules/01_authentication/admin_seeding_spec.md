# Specification: Initial Admin Seeding & Development Bypass

**Feature**: 01-admin-seeding-dev  
**Module**: 01_authentication  
**Environment**: Development / Local Testing  

---

## 1. Backend Seeding Invariants

Upon application startup (FastAPI Lifespan Startup Event), the system MUST perform an idempotent check on the `users` table.

- **Trigger Condition**: If `COUNT(users) == 0`.
- **Action**: Read environment variables and inject the initial root administrator.
- **Variables Required (.env)**:
  ```env
  INITIAL_ADMIN_EMAIL=admin@admin.com
  INITIAL_ADMIN_PASSWORD=admin1234
  INITIAL_ADMIN_ROLE=Admin

- Execution: The password MUST be safely hashed via Bcrypt before database insertion. The transaction must commit atomically.

## 2. Frontend Development Bypass (No-Login Workaround)
Until the formal Login User Story is planned and implemented, the Frontend application needs an authorized context to test the User Registration UI.

- **Mechanism**: In development mode (`NODE_ENV=development`), the application state provider or authentication context MUST support a hardcoded or pre-fetched session.

- **Implementation Choice**: A temporary "Bypass Token" or a development login utility that automatically appends a working Admin identity into the application's local storage state, enabling the Authorization headers to fetch properly during `US-01` validation testing.

