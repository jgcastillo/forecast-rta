# Backend Specification: Modify User Data (US-03)

**Feature**: 03-modify-user-api  
**Module**: 01_authentication  
**Endpoint**: PATCH `/api/v1/users/{user_id}`

---

## 1. Data Model & Cryptographic Invariants

This endpoint allows partial updates to an existing user's profile.

- **Payload Input (`UserUpdate` Schema)**: All fields must be `Optional`. Allowed fields: `first_name`, `last_name`, `is_active`, `role`.
- **Security Guard**: The endpoint MUST be protected by the `get_current_user` dependency. Only users with the `Admin` role can modify other users' roles or `is_active` status.
- **Immutability**: The `email` and `id` fields CANNOT be modified through this endpoint.
- **Audit Requirement**: Any successful modification MUST generate a new entry in the `audit_logs` table with the action `USER_UPDATED`, storing the modified fields in the `details` JSON column.

---

## 2. Response Matrix & State Transitions

| HTTP Status | Condition |
|---|---|
| **200 OK** | User updated successfully. Returns the updated `UserResponse` object. |
| **403 Forbidden** | The requester is not an Admin. |
| **404 Not Found** | The `user_id` does not exist in the database. |