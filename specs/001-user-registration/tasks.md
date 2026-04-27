# Tasks: User Registration

## Phase 1: Setup & Foundation
- [ ] T001 Initialize FastAPI app structure and PostgreSQL connection.
- [ ] T002 Create `UserRole` Enum and `User` domain model in `src/auth/domain/`.
- [ ] T003 Setup Alembic for `users` table migration.

## Phase 2: Implementation (TDD)
- [ ] T004 [US1] Write failing test for user creation in `tests/integration/test_user_api.py`.
- [ ] T005 [US1] Implement `UserRepository` with SQLModel.
- [ ] T006 [US1] Implement `RegisterUser` use case.
- [ ] T007 [US1] Implement FastAPI router and register in main app.

## Phase 3: Validation & Polish
- [ ] T008 [US2] Implement duplicate email handling (409 Conflict).
- [ ] T009 Run `quickstart.md` validation.