# Technical Specification: Core Infrastructure (Dockerized Environment)

## 1. Goal
Establish a unified, containerized development and testing environment for the **forecast_rta** project to ensure 100% DevProd Parity and isolated persistence for TDD[cite: 3, 4, 8].

## 2. Infrastructure Requirements (Functional)
- **Unified Orchestration**: Full stack (Backend, Frontend, DB) must be manageable via a single `docker-compose.yml`[cite: 4].
- **Service Isolation**: 
    - `api`: Backend service using Python 3.13+.
    - `web`: Frontend service using Node 26+ for React/Vite.
    - `db`: Persistence service using PostgreSQL 18+.
- **Hot-Reloading**: Local source code changes must synchronize with containers via bind mounts[cite: 4].
- **Automated Networking**: Services must communicate through a private Docker bridge network using internal hostnames.

## 3. Test Isolation Requirements (Critical)[cite: 8]
- **Test Session DB**: The testing environment MUST NOT touch the development database.
- **Auto-Provisioning**: Infrastructure must support spinning up an ephemeral database container or an in-memory SQLite instance for Pytest runs[cite: 1, 8].

## 4. Acceptance Criteria
- [ ] `docker-compose up` builds and starts all 3 services without manual intervention.
- [ ] Backend container can connect to PostgreSQL using credentials from `.env`.
- [ ] Hot-reload works for both React and FastAPI.
- [ ] Pytest execution runs in a container with a clean, dedicated test database[cite: 8].