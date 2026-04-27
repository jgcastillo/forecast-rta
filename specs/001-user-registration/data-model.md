*Modelado para SQLModel y PostgreSQL.*

```markdown
# Data Model: User Registration

**Storage**: PostgreSQL (via SQLModel)

## 1. Entity: User
The core identity record for system access.

| Field | Python Type | DB Type | Constraints |
|---|---|---|---|
| `id` | `uuid.UUID` | `UUID` | PK, Default: uuid4 |
| `full_name` | `str` | `VARCHAR(100)` | NOT NULL |
| `email` | `str` | `VARCHAR(255)` | NOT NULL, UNIQUE, INDEX |
| `role` | `UserRole` (Enum) | `VARCHAR(20)` | NOT NULL |
| `status` | `str` | `VARCHAR(20)` | NOT NULL, Default: 'active' |
| `created_at` | `datetime` | `TIMESTAMP` | NOT NULL, Default: now() |

## 2. Validation Rules (Domain Layer)
- `email`: Must be a valid string (presence check). Uniqueness enforced at DB level.
- `role`: Must be one of the three defined roles.
- `full_name`: Trimmed and non-empty.