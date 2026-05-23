from uuid import UUID
from auth.infrastructure.db.repository import UserRepository
from auth.infrastructure.db.models import User
from auth.infrastructure.security.hasher import hash_password
from auth.infrastructure.api.errors import ConflictError
from auth.application.audit_service import AuditService
from auth.infrastructure.services.email_dispatcher import EmailDispatcher

class RegisterUser:
    """Use Case to handle registration of new users by an Administrator, including audit logging and password notification."""
    
    def __init__(self, repository: UserRepository, audit_service: AuditService, email_dispatcher: EmailDispatcher):
        self.repository = repository
        self.audit_service = audit_service
        self.email_dispatcher = email_dispatcher

    def execute(self, email: str, first_name: str, last_name: str, role: str, password: str, actor_id: UUID) -> User:
        """Execute user registration logic, write audit logs, and dispatch password email.
        
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
        saved_user = self.repository.save(db_user)
        
        # Audit log the registration action
        self.audit_service.log_registration(actor_id=actor_id, target_id=saved_user.id)
        
        # Dispatch credentials notification
        self.email_dispatcher.send_temporary_password(to_email=saved_user.email, temporary_password=password)

        return saved_user
