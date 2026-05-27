# Implementation Plan: Modify User Backend (US-03)

**Approach**: Test-Driven Development (TDD) & Hexagonal Architecture basics.

---

## 1. Structural Steps

1. **Domain/Schema**: Define `UserUpdate` Pydantic model in `src/auth/domain/schemas.py`.
2. **Infrastructure**: Implement the `update_user` logic inside the database repository, ensuring the SQLModel session (`from sqlmodel import Sesion`) commits both the User changes and the `AuditLog` entry atomically.
3. **Controller**: Create the PATCH route in `src/auth/infrastructure/api/routes.py`.