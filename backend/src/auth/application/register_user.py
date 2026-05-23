from auth.infrastructure.db.repository import UserRepository
from auth.infrastructure.db.models import User
from auth.infrastructure.security.hasher import hash_password
from auth.infrastructure.api.errors import ConflictError

class RegisterUser:
    """Use Case to handle registration of new users by an Administrator."""
    
    def __init__(self, repository: UserRepository):
        self.repository = repository

    def execute(self, email: str, first_name: str, last_name: str, role: str, password: str) -> User:
        """Execute user registration logic.
        
        Raises:
            ConflictError: If the email is already registered.
        """
        # Enforce email uniqueness
        existing_user = self.repository.get_by_email(email)
        if existing_user:
            raise ConflictError(f"Email {email} is already registered")

        # Hash the plain-text password using Bcrypt
        hashed_password = hash_password(password)

        # Instantiate user entity
        db_user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=role,
            hashed_password=hashed_password
        )

        # Persist user
        return self.repository.save(db_user)
