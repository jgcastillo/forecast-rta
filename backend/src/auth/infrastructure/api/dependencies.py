from fastapi import Depends, Security
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from jose import JWTError
from sqlmodel import Session

from auth.infrastructure.db.session import get_session
from auth.infrastructure.db.repository import UserRepository
from auth.infrastructure.db.models import User
from auth.domain.models import UserRole
from auth.domain.roles import get_allowed_scopes_for_role
from auth.infrastructure.security.jwt_handler import decode_access_token
from auth.infrastructure.api.errors import UnauthorizedError, ForbiddenError

# OAuth2PasswordBearer extracts token from Authorization: Bearer <token>
# We register oauth2_scheme with scopes so Swagger UI knows about them
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="auth/token",
    scopes={
        "role:admin": "Administrator access",
        "role:analyst": "Analyst access",
        "role:reviewer": "Reviewer access",
    }
)

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
    security_scopes: SecurityScopes,
    current_user: User = Depends(get_current_user)
) -> User:
    """Validate that the authenticated user is active and has the required scopes."""
    if not current_user.is_active:
        raise ForbiddenError("User account is suspended/inactive")
        
    # Check if there are security scopes requested on the route
    if security_scopes.scopes:
        user_scopes = get_allowed_scopes_for_role(current_user.role)
        for scope in security_scopes.scopes:
            if scope not in user_scopes:
                raise ForbiddenError(f"Insufficient permissions. Required scope: {scope}")
                
    return current_user

def require_admin(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Validate that the active user is an Administrator."""
    if current_user.role != UserRole.ADMIN:
        raise ForbiddenError("Only Administrators are authorized to perform this action")
    return current_user
