
# Data Model: User Registration (US-01)

**Feature**: 01-user-registration  
**Date**: 2026-05-15  
**Storage**: PostgreSQL (Containerized)

---

## 1. Entity: User

The **User** entity manages identity and access control within the modular monolith. It implements RBAC (Role-Based Access Control) using predefined scopes.

### 1.1 Fields

| Field | Python Type | DB Column | DB Type | Constraints | Notes |
|---|---|---|---|---|---|
| `id` | `uuid.UUID` | `id` | `UUID` | PK, Default: `uuid4` | Primary identifier |
| `email` | `str` | `email` | `VARCHAR(255)` | UNIQUE, INDEX, NOT NULL | Used as login username |
| `hashed_password`| `str` | `hashed_password` | `VARCHAR(255)` | NOT NULL | Bcrypt hashed string |
| `first_name` | `str` | `first_name` | `VARCHAR(100)` | NOT NULL | User's legal name |
| `last_name` | `str` | `last_name` | `VARCHAR(100)` | NOT NULL | User's legal surname |
| `role` | `UserRole` (enum) | `role` | `VARCHAR(20)` | NOT NULL | Admin, Analyst, or Reviewer |
| `is_active` | `bool` | `is_active` | `BOOLEAN` | DEFAULT `true` | For account suspension |
| `created_at` | `datetime` | `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Audit timestamp (UTC) |

### 1.2 UserRole Enum

```python
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "Admin"
    ANALYST = "Analyst"
    REVIEWER = "Reviewer"
```
## 2. Entity: AuditLog
The AuditLog entity registers all administrative and sensitive operations inside the system to guarantee transparency and compliance.

### 2.1 Fields
| Field | Python Type | DB Column | DB Type | Constraints | Notes |
|:------|:------------|:----------|:--------|:------------|:------|
| `id` | `uuid.UUID` | `id` | `UUID` | PK, Default: `uuid4` | Primary identifier |
| `actor_id` | `uuid.UUID` | `actor_id` | `UUID` | NOT NULL | The Admin who performed the action |
| `target_id`| `uuid.UUID` | `target_id` | `UUID` | NOT NULL | The newly created user's ID |
| `action` | `str` | `action` | `VARCHAR(50)` | NOT NULL | Fixed event name: 'USER_REGISTRATION' |
| `created_at` | `datetime` | `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Exact execution timestamp (UTC) |

## 3. SQLModel Implementation
We use a multi-class approach to distinguish between API schemas (Data Transfer Objects) and Database tables, ensuring the hashed_password is never exposed to the client.

## 3.1 User Base Schema (Shared fields)
```python
from sqlmodel import SQLModel, Field
from auth.domain.models import UserRole

class UserBase(SQLModel):
    email: str = Field(index=True, unique=True)
    first_name: str
    last_name: str
    role: UserRole = Field(default=UserRole.REVIEWER)
    is_active: bool = True
```
## 3.2 User API Schemas (Input / Output Contracts)
```python
from uuid import UUID
from datetime import datetime
from sqlmodel import SQLModel

class UserCreate(UserBase):
    password: str  # Plain text password submitted by Admin, validated at the edge

class UserResponse(UserBase):
    id: UUID
    created_at: datetime
```

## 3.3 User Database Table
```python
from uuid import UUID, uuid4
from datetime import datetime, timezone
from sqlmodel import Field

class User(UserBase, table=True):
    __tablename__ = "users"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
```    
## 3.4 AuditLog Database Table
```python
from uuid import UUID, uuid4
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field

class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_logs"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    actor_id: UUID = Field(foreign_key="users.id")
    target_id: UUID
    action: str = "USER_REGISTRATION"
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
```
## 4. Validation Rules (Edge Invariants)
These rules are enforced by Pydantic's internal validation engine within UserCreate before data hits the Application layer.

| `Field` | `Rule` | `Error Message / HTTP Code`|
|---|---|---|
| `email` | `Must be a valid RFC 5321 email format`| `422 Unprocessable Entity (Invalid email format)`| 
| `email` | `Must be unique in the database` | `409 Conflict (Email already registered)`|
| `password` | `Minimum 8 characters, at least 1 number and 1 letter` | `422 Unprocessable Entity (Password too weak)`|
| `role` | `Must match one of the UserRole enum values` | `422 Unprocessable Entity (Invalid role assigned)`|
|`first_name` | `Not null, not blank (trimmed)` | `422 Unprocessable Entity (First name is required)`|
| `last_name` | `Not null, not blank (trimmed)`| `422 Unprocessable Entity (Last name is required)`|

### 5. State Transitions

```[Admin Token + UserCreate JSON]
               ↓
     Validate API Schemas (Pydantic)
               ↓
     [UserBase (Valid Data)] 
               ↓
  Domain Layer (Hash Password via Bcrypt)
               ↓
    [User (Table) + AuditLog (Table)] 
               ↓
Atomic DB Transaction (Commit to Postgres)
               ↓
       [UserResponse JSON]``

