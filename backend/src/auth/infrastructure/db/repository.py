from uuid import UUID
from sqlmodel import Session, select
from auth.infrastructure.db.models import User

class UserRepository:
    """SQLModel-based repository implementation for User persistence."""
    
    def __init__(self, session: Session):
        self.session = session

    def get_by_email(self, email: str) -> User | None:
        """Find a user by email."""
        statement = select(User).where(User.email == email)
        return self.session.exec(statement).first()

    def get_by_id(self, user_id: UUID) -> User | None:
        """Find a user by id."""
        return self.session.get(User, user_id)

    def get_all(self) -> list[User]:
        """Find all users."""
        statement = select(User)
        return self.session.exec(statement).all()

    def save(self, user: User) -> User:
        """Save/persist a user to the database."""
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user

    def update_user(self, user: User, update_data: dict, actor_id: UUID) -> User:
        """Update a user's fields and insert an AuditLog entry atomically."""
        for key, value in update_data.items():
            setattr(user, key, value)
        
        self.session.add(user)
        
        from auth.infrastructure.db.models_audit import AuditLog
        audit_log = AuditLog(
            actor_id=actor_id,
            target_id=user.id,
            action="USER_UPDATED",
            details=update_data
        )
        self.session.add(audit_log)
        self.session.commit()
        self.session.refresh(user)
        return user
