# API Contract: User Registration

**Feature**: 001-user-registration  
**Interface Type**: RESTful API  
**Base Path**: `/api/v1`

---

## 1. Create User Endpoint

`POST /auth/users`

### Request Body (JSON)
| Field | Type | Required | Description |
|---|---|---|---|
| `full_name` | `string` | Yes | User's complete name |
| `email` | `string` | Yes | Unique professional email |
| `role` | `string` | Yes | One of: `admin`, `analyst`, `reviewer` |

### Success Response (201 Created)
```json
{
  "id": "uuid-string",
  "full_name": "John Doe",
  "email": "john@rta.com",
  "role": "analyst",
  "status": "active",
  "created_at": "2026-04-26T10:00:00Z"
}

### Error Responses
- **400 Bad Request**: Missing fields or invalid role.

- **409 Conflict**: Email already registered.

- **500 Internal Server Error**: Database connection failure.