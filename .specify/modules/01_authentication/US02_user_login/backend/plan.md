# Implementation Plan: User Login Backend (US-02)

**Approach**: Test-Driven Development (TDD)  
**Layer**: Infrastructure (Controllers/Routers) & Application (Use Cases)

---

## 1. Structural Steps

1. **Security Security Utilities**: Create Token Generation service under `src/auth/application/security.py` using `python-jose` or PyJWT.
2. **Login Controller Router**: Create the POST router in `src/auth/infrastructure/api/routes.py` consuming `OAuth2PasswordRequestForm`.
3. **Dependency Injection**: Implement `get_current_user` dependency in `src/auth/infrastructure/api/deps.py` to parse and decode the JWT for other protected endpoints (like User Registration).