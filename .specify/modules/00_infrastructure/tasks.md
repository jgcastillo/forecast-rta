# Infrastructure Tasks: Módulo 00

## Phase 1: Docker Foundation
- [ ] Create `docker-compose.yml` defining `api`, `web`, and `db` services.
- [ ] Create `backend/Dockerfile` using multi-stage builds (Development vs. Production).
- [ ] Create `frontend/Dockerfile` for React/Vite.
- [ ] Configure `postgres` service with healthcheck and volume persistence.

## Phase 2: Configuration & Secrets[cite: 3]
- [ ] Generate `.env.example` with required variables (DB_USER, DB_PASSWORD, DB_NAME).
- [ ] Implement `.dockerignore` files for both Backend and Frontend to optimize build contexts.

## Phase 3: TDD Readiness[cite: 8]
- [ ] Configure a `test-db` service or logic in `conftest.py` to handle ephemeral sessions[cite: 1].
- [ ] Create a shell script `bin/test.sh` to run Pytest within the `api` container.

## Phase 4: Validation
- [ ] **Task**: Run `docker-compose up --build` and verify service health.
- [ ] **Task**: Verify hot-reload by changing a log message in `api/main.py`.