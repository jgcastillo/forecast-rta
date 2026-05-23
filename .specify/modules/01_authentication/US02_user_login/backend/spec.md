# Backend Specification: User Login (US-02)

**Feature**: 01-user-login-api  
**Module**: 01_authentication  
**Endpoint**: POST `/api/v1/auth/login` (OAuth2 Password Bearer standard)

---

## 1. Cryptographic & Protocol Invariants

The login system implements standard OAuth2 token issuance using JWT (JSON Web Tokens).

- **Payload Input Format**: `application/x-www-form-urlencoded` (Standard OAuth2 form data containing `username` as email and `password`).
- **Password Verification**: The plain-text password must be matched against the stored hash in the `users` table via Bcrypt validation.
- **Token Constraints**:
  - Algorithm: `HS256`
  - Expiration: 60 minutes (`access_token_expire_minutes=60`).
  - Claims Required: `sub` (User Email), `role` (User Role string), `exp` (Expiration Timestamp).

---

## 2. Response Matrix & State Transitions

| HTTP Status | Condition | Payload / Behavior |
|---|---|---|
| **200 OK** | Valid credentials provided. | Returns `{"access_token": "string", "token_type": "bearer"}` |
| **401 Unauthorized** | Email does not exist OR Password hash mismatch. | Returns `{"detail": "Incorrect email or password"}` |
| **403 Forbidden** | User exists but `is_active == false`. | Returns `{"detail": "Inactive user account"}` |