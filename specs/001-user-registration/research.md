# Research: User Registration — Phase 0

## 1. SQLModel & PostgreSQL Integration
**Decision**: Use `SQLModel` for unified Pydantic/ORM mapping.
**Rationale**: Reduces boilerplate by sharing schemas between the API (FastAPI) and the Database (PostgreSQL).

## 2. Hexagonal Package Structure
**Decision**: Follow strict isolation:
- `domain.models`: Pure Python User entity.
- `application.use_cases`: `RegisterUser` logic.
- `infrastructure.repositories`: SQLModel implementation.
- `infrastructure.api`: FastAPI routers.

## 3. Testing Strategy
**Decision**: Use `pytest` with `httpx` for API testing and a Dockerized PostgreSQL (or Testcontainers) for integration.