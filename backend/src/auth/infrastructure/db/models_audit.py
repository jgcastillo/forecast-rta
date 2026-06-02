from uuid import UUID, uuid4
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON

class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_logs"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    actor_id: UUID = Field(nullable=False)
    target_id: UUID = Field(nullable=False)
    action: str = Field(nullable=False, max_length=50)
    details: dict | None = Field(default=None, sa_column=Column(JSON, nullable=True))
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )
