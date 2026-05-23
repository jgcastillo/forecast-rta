from uuid import UUID
from datetime import datetime
from pydantic import EmailStr, Field, field_validator
import re
from auth.infrastructure.db.models import UserBase
from auth.domain.models import UserRole

class UserCreate(UserBase):
    email: EmailStr  # Pydantic's EmailStr validates email format automatically
    password: str = Field(min_length=8)

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        """Validate password strength (at least 1 letter and 1 number)."""
        if not re.search(r"[A-Za-z]", v) or not re.search(r"[0-9]", v):
            raise ValueError("Password too weak: must contain at least one letter and one number")
        return v

    @field_validator("first_name", "last_name")
    @classmethod
    def validate_names_not_empty(cls, v: str) -> str:
        """Validate names are not blank and trim whitespace."""
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("First name and last name cannot be empty")
        return trimmed

class UserResponse(UserBase):
    id: UUID
    created_at: datetime
