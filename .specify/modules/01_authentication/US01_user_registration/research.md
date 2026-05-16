# Research: User Registration & Security — Phase 0

**Feature**: 01-user-registration  
**Date**: 2026-04-29  
**Status**: Complete — OAuth2 and JWT Strategy Defined

---

## 1. Password Hashing Strategy (Bcrypt)

**Decision**: Use **Passlib** with the `bcrypt` backend for all password hashing operations.

**Rationale**:
- Bcrypt is a standard, salt-based hashing algorithm that is resistant to brute-force and rainbow table attacks.
- Passlib handles salt generation and work-factor (rounds) automatically, preventing common implementation errors.
- It is natively supported by FastAPI's security utilities.

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| Argon2 | Superior but requires extra binary dependencies that can complicate the Docker build in some environments. |
| SHA-256 (Plain) | Not a password hashing function; vulnerable to high-speed GPU cracking. |
| MD5 | Completely compromised and insecure. |

---

## 2. Token Specification (JWT & OAuth2)

**Decision**: Implement **OAuth2 with Password Flow** returning a **JSON Web Token (JWT)** signed with the `HS256` algorithm.

**Rationale**:
- **Statelessness**: Allows the backend to verify identity without querying the database on every request, improving performance for the forecasting engine.
- **FastAPI Integration**: FastAPI provides the `OAuth2PasswordBearer` class, which automatically handles token extraction and provides a built-in "Authorize" button in the Swagger UI (`/docs`).
- **Scopes for RBAC**: We will use the `scopes` claim in the JWT to transport the user's role (Admin, Analyst, Reviewer), facilitating decentralized authorization across modules.[cite: 1]

**Configuration**:
- `ALGORITHM`: HS256
- `ACCESS_TOKEN_EXPIRE_MINUTES`: 30 (for security balance)
- `SECRET_KEY`: Managed via environment variables (NEVER hardcoded).

---

## 3. Persistence Layer (SQLModel & Alembic)

**Decision**: Use **SQLModel** (which combines SQLAlchemy and Pydantic) for entities, and **Alembic** for all schema migrations.[cite: 1]

**Rationale**:
- **Type Safety**: SQLModel allows us to use the same class for the database model and the API response/request, reducing boilerplate code.[cite: 1]
- **Migration Control**: Unlike the "Startup DDL" in the CLI example, a production system like forecast_rta requires Alembic to track changes in inventory and sales tables over time without data loss.[cite: 1]
- **PostgreSQL Native Features**: Leveraging JSONB or specific numeric precisions for sales averages ($12m/6m$) is easier through SQLAlchemy's core which powers SQLModel.[cite: 1]

---

## 4. Audit Log Implementation Pattern

**Decision**: Implement a **Synchronous Hook** within the `RegisterUser` Use Case to persist registration events in an `audit_logs` table.[cite: 1]

**Rationale**:
- Since user registration is an infrequent but critical administrative action, a synchronous log ensures that the registration and the audit record are part of the same database transaction.[cite: 1]
- Ensures compliance with the PRD's goal of transparency and error reduction.[cite: 1]

---

## Summary of All Decisions

| Topic | Decision | Key Reference |
|---|---|---|
| Password Hashing | Passlib + Bcrypt | §1 |
| Authentication | OAuth2 Password Flow + JWT (HS256) | §2 |
| Persistence | SQLModel + PostgreSQL + Alembic | §3 |
| Audit Strategy | Transactional Audit Log Table | §4 |
| Authorization | Role-based Scopes (Admin/Analyst/Reviewer) | §2 |