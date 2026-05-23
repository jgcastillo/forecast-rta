from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlmodel import Session

from auth.infrastructure.db.session import get_session
from auth.infrastructure.db.repository import UserRepository
from auth.infrastructure.db.models import User
from auth.domain.models import UserRole
from auth.infrastructure.security.jwt_handler import decode_access_token
from auth.infrastructure.api.errors import UnauthorizedError, ForbiddenError

# OAuth2PasswordBearer extracts token from Authorization: Bearer <token>
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def get_user_repository(session: Session = Depends(get_session)) -> UserRepository:
    """FastAPI Dependency injection for UserRepository."""
    return UserRepository(session)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    repository: UserRepository = Depends(get_user_repository)
) -> User:
    """Extract and validate JWT to yield current authenticated User."""
    try:
        payload = decode_access_token(token)
        email: str | None = payload.get("sub")
        if not email:
            raise UnauthorizedError("Invalid authentication credentials (missing sub claim)")
    except JWTError as e:
        raise UnauthorizedError(f"Could not validate credentials: {str(e)}")
        
    user = repository.get_by_email(email)
    if not user:
        raise UnauthorizedError("Authenticated user no longer exists in system")
        
    return user

def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Validate that the authenticated user is active."""
    if not current_user.is_active:
        raise ForbiddenError("User account is suspended/inactive")
    return current_user

def require_admin(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Validate that the active user is an Administrator."""
    if current_user.role != UserRole.ADMIN:
        raise ForbiddenError("Only Administrators are authorized to perform this action")
    return current_user
