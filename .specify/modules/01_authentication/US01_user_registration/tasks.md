# Tasks: User Registration (US-01)

**Input**: Design documents from `/.specify/modules/01_authentication/US01_user_registration/`
**Prerequisites**: `plan.md`, `spec.md`, `data-model.md`

**Organization**: Tasks are grouped by phase and user story to ensure Hexagonal integrity and TDD compliance.

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create backend directory structure: `auth/domain`, `auth/application`, `auth/infrastructure`
- [x] T002 [P] Configure `pyproject.toml` with dependencies: `fastapi`, `sqlmodel`, `python-jose`, `passlib[bcrypt]`
- [x] T003 [P] Setup `pytest` and `loguru` configuration in `backend/tests/conftest.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T004 Setup Database engine and Session utilities in `backend/src/auth/infrastructure/db/session.py`
- [x] T005 [P] Implement JWT Utility service (token creation/decoding) in `backend/src/auth/infrastructure/security/jwt_handler.py`
- [x] T006 [P] Implement Password Hashing utility in `backend/src/auth/infrastructure/security/hasher.py`
- [x] T007 Create Base `User` and `Role` Enums in `backend/src/auth/domain/models.py`
- [x] T008 Setup Global Exception Handler for Auth Module in `backend/src/auth/infrastructure/api/errors.py`

**Checkpoint**: Foundation ready - Authentication infrastructure and security utilities are in place.

---

## Phase 3: User Story 1 - Basic Account Creation (Priority: P1) 🎯 MVP

**Goal**: Allow Administrator to create valid user accounts with specific roles.

**Independent Test**: Execute `pytest tests/auth/integration/test_registration.py` to verify successful user creation via API.

### Tests for User Story 1 (TDD - Write FIRST)

- [x] T009 [P] [US1] Create unit test for `User` domain entity validation in `backend/tests/auth/unit/test_user_domain.py`
- [x] T010 [P] [US1] Create integration test for `/auth/register` endpoint (Happy Path & Email Conflict) in `backend/tests/auth/integration/test_registration.py`

### Implementation for User Story 1

- [x] T011 [P] [US1] Define `UserCreate` and `UserResponse` Pydantic schemas in `backend/src/auth/infrastructure/api/schemas.py`
- [x] T012 [P] [US1] Implement `UserRepository` (SQLModel) in `backend/src/auth/infrastructure/db/repository.py`
- [x] T013 [US1] Implement `RegisterUser` Use Case in `backend/src/auth/application/register_user.py` (Depends on T012)
- [x] T014 [US1] Create FastAPI Router for Registration in `backend/src/auth/infrastructure/api/routes.py`
- [x] T015 [US1] Integrate `OAuth2PasswordBearer` in `backend/src/auth/infrastructure/api/dependencies.py`

**Checkpoint**: User Story 1 is functional. Users can be registered and persisted in PostgreSQL.

---

## Phase 4: User Story 2 - Role-Based Access Initialization (Priority: P2)

**Goal**: Ensure users are tied to Admin, Analyst, or Reviewer roles with proper OAuth2 scopes.[cite: 1]

**Independent Test**: Verify that a token issued for a "Reviewer" does not allow access to "Analyst" restricted endpoints.

### Tests for User Story 2

- [x] T016 [P] [US2] Create test for Role-to-Scope mapping logic in `backend/tests/auth/unit/test_roles.py`
- [x] T017 [US2] Create integration test for Protected Routes using JWT Scopes in `backend/tests/auth/integration/test_rbac.py`

### Implementation for User Story 2

- [x] T018 [P] [US2] Implement Role validation logic in `backend/src/auth/domain/roles.py`
- [x] T019 [US2] Implement `get_current_active_user` dependency with scope validation in `backend/src/auth/infrastructure/api/dependencies.py`

---

## Phase 5: User Story 3 - Security & Audit Readiness (Priority: P3)

**Goal**: Implement Audit Logging for every registration and prepare notification hooks.[cite: 1]

**Independent Test**: Verify that a record is created in the `audit_logs` table after each registration.[cite: 1]

### Tests for User Story 3

- [x] T020 [P] [US3] Create test for `AuditLog` creation after successful registration in `backend/tests/auth/integration/test_audit.py`

### Implementation for User Story 3

- [x] T021 [P] [US3] Create `AuditLog` SQLModel entity in `backend/src/auth/infrastructure/db/models_audit.py`
- [x] T022 [US3] Implement Audit Service and link it to the `RegisterUser` use case.
- [x] T023 [US3] Setup basic SMTP/Email dispatcher hook for temporary password notification.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T024 [P] Update `README.md` with Auth Module API documentation.
- [x] T025 Run `alembic revision --autogenerate` to finalize database migration for US-01.
- [x] T026 [P] Security audit: Ensure no plain-text passwords are logged in `loguru` outputs.
- [x] T027 Final validation of `quickstart.md` steps.

---

## Dependencies & Execution Order

1. **Phase 1 & 2** are mandatory and must be completed sequentially as they provide the security context for all stories.
2. **Phase 3 (P1)** is the MVP. It can be developed as soon as Phase 2 is done.
3. **Phases 4 & 5** can run in parallel once Phase 3's repository and models are stable.
4. **TDD Rule**: Tasks T009, T010, T016, T017, and T020 MUST be executed first and must FAIL before their respective implementation tasks start.