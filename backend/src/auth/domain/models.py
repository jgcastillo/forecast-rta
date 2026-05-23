from enum import Enum
import uuid
import re
from datetime import datetime, timezone

class UserRole(str, Enum):
    ADMIN = "Admin"
    ANALYST = "Analyst"
    REVIEWER = "Reviewer"

class User:
    """Pure domain entity representing a system user."""
    
    def __init__(
        self,
        email: str,
        first_name: str,
        last_name: str,
        role: UserRole,
        hashed_password: str,
        id: uuid.UUID | None = None,
        is_active: bool = True,
        created_at: datetime | None = None,
    ):
        self.id = id or uuid.uuid4()
        self.email = email
        self.first_name = first_name.strip() if first_name else ""
        self.last_name = last_name.strip() if last_name else ""
        self.role = role
        self.hashed_password = hashed_password
        self.is_active = is_active
        self.created_at = created_at or datetime.now(timezone.utc)
        
        self.validate()

    def validate(self) -> None:
        """Enforce domain-level invariant rules."""
        if not self.email or not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", self.email):
            raise ValueError("Invalid email format")
        if not self.first_name:
            raise ValueError("First name is required")
        if not self.last_name:
            raise ValueError("Last name is required")
        if self.role not in [role for role in UserRole]:
            raise ValueError("Invalid role assigned")
