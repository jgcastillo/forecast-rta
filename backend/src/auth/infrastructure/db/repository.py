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

    def save(self, user: User) -> User:
        """Save/persist a user to the database."""
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user
