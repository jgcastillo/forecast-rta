# API Contract: User Registration (US-01)

**Feature**: 01-user-registration
**Status**: Finalized
**Base Path**: `/api/v1/auth`

## 1. Overview
This contract defines the communication interface for user management and authentication. All requests and responses MUST be in `application/json` format.

## 2. Endpoints

### POST `/register`
Creates a new user in the system. Restricted to users with the `Admin` role.

**Request Body**:
```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "user@example.com",
  "password": "string",
  "role": "Admin | Analyst | Reviewer"
}
```
**Success Response**:
- **Code**: 201 CREATED
- **Body**:
```json
{
  "id": "uuid",
  "first_name": "string",
  "last_name": "string",
  "email": "user@example.com",
  "role": "string",
  "is_active": true,
  "created_at": "ISO8601-Timestamp"
}
```
**Error Responses**:
- **400 Bad Request**: Validation error (invalid email format or missing fields).
- **401 Unauthorized**: Missing or invalid Administrator token.
- **403 Forbidden**: Authenticated user does not have `Admin` permissions.
- **409 Conflict**: Email is already registered.

---

### POST `/token` (OAuth2 Compatible)
Authenticates a user and returns an access token.

**Request (x-www-form-urlencoded)**:
- `username`: The user's email.
- `password`: The user's password.

**Success Response**:
- **Code**: 200 OK
- **Body**:
```json
{
  "access_token": "eyJhbG...",
  "token_type": "bearer"
}
```
## 3. Security Requirements
- **Authentication**: Bearer Token (JWT) required for `/register`.
- **Authorization**: Scopes defined per role:
    - `role:admin`: Full access to user management.
    - `role:analyst`: Access to sales data and forecast adjustments.
    - `role:reviewer`: Read-only access to dashboards and reports.

## 4. Audit Expectations
Every successful call to `/register` MUST trigger an internal audit event capturing the `admin_id` and the `target_user_id`.
