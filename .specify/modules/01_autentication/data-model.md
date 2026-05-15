# Data Model: User Registration (US-01)

**Feature**: 01-user-registration  
**Date**: 2026-04-29  
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
| `created_at` | `datetime` | `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Audit timestamp |

### 1.2 UserRole Enum
```python
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "Admin"
    ANALYST = "Analyst"
    REVIEWER = "Reviewer"
```
## 2. SQLModel Implementation
We use a multi-class approach to distinguish between API schemas and Database tables, ensuring the hashed_password is never exposed.

### 2.1 Base Schema (Shared fields)
```python
from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

class UserBase(SQLModel):
    email: str
    first_name: str
    last_name: str
    role: UserRole
```
### 2.2 Database Table (User Table)
```python
from sqlmodel import SQLModel, Field
from uuid import UUID, uuid4
from datetime import datetime

class UserBase(SQLModel):
    email: str = Field(index=True, unique=True)
    first_name: str
    last_name: str
    role: UserRole = Field(default=UserRole.REVIEWER)
    is_active: bool = True
```
### 2.2 Database Table
```Python
class User(UserBase, table=True):
    __tablename__ = "users"
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
```