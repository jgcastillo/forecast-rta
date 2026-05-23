from sqlmodel import Session
from auth.infrastructure.db.models_audit import AuditLog

class AuditRepository:
    """SQLModel-based repository implementation for AuditLog persistence."""
    
    def __init__(self, session: Session):
        self.session = session

    def save(self, audit_log: AuditLog) -> AuditLog:
        """Save/persist an audit log record to the database."""
        self.session.add(audit_log)
        self.session.commit()
        self.session.refresh(audit_log)
        return audit_log
