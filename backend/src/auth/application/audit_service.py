from uuid import UUID
from auth.infrastructure.db.repository_audit import AuditRepository
from auth.infrastructure.db.models_audit import AuditLog

class AuditService:
    """Application Service to coordinate auditing of business events."""
    
    def __init__(self, repository: AuditRepository):
        self.repository = repository

    def log_registration(self, actor_id: UUID, target_id: UUID) -> AuditLog:
        """Log a user registration event."""
        audit_log = AuditLog(
            actor_id=actor_id,
            target_id=target_id,
            action="USER_REGISTRATION"
        )
        return self.repository.save(audit_log)
