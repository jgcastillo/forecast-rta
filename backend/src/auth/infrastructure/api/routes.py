from fastapi import APIRouter, Depends, Security, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from auth.infrastructure.db.session import get_session
from auth.infrastructure.db.repository import UserRepository
from auth.infrastructure.db.repository_audit import AuditRepository
from auth.infrastructure.services.email_dispatcher import EmailDispatcher
from auth.application.register_user import RegisterUser
from auth.application.audit_service import AuditService
from auth.infrastructure.api.schemas import UserCreate, UserResponse
from auth.infrastructure.api.dependencies import require_admin, get_user_repository, get_current_active_user
from auth.infrastructure.security.hasher import verify_password
from auth.infrastructure.security.jwt_handler import create_access_token
from auth.infrastructure.api.errors import UnauthorizedError, ForbiddenError

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_audit_repository(session: Session = Depends(get_session)) -> AuditRepository:
    """Dependency injection to obtain AuditRepository."""
    return AuditRepository(session)

def get_audit_service(repository: AuditRepository = Depends(get_audit_repository)) -> AuditService:
    """Dependency injection to obtain AuditService."""
    return AuditService(repository)

def get_email_dispatcher() -> EmailDispatcher:
    """Dependency injection to obtain EmailDispatcher."""
    return EmailDispatcher()

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user (Admin only)"
)
def register(
    user_in: UserCreate,
    repository: UserRepository = Depends(get_user_repository),
    audit_service: AuditService = Depends(get_audit_service),
    email_dispatcher: EmailDispatcher = Depends(get_email_dispatcher),
    current_admin = Depends(require_admin)
):
    """Register a new user account. Only accessible by Administrators."""
    use_case = RegisterUser(repository, audit_service, email_dispatcher)
    new_user = use_case.execute(
        email=user_in.email,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        role=user_in.role,
        password=user_in.password,
        actor_id=current_admin.id
    )
    return new_user

@router.post(
    "/token",
    summary="Obtain OAuth2 Access Token"
)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    repository: UserRepository = Depends(get_user_repository)
):
    """OAuth2 compatible login. Authenticates credentials and returns a JWT access token."""
    user = repository.get_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise UnauthorizedError("Incorrect email or password")
    
    if not user.is_active:
        raise UnauthorizedError("User account is inactive")
        
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post(
    "/login",
    summary="User Login"
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    repository: UserRepository = Depends(get_user_repository)
):
    """User login. Authenticates credentials and returns a JWT access token."""
    user = repository.get_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise UnauthorizedError("Incorrect email or password")
    
    if not user.is_active:
        raise ForbiddenError("Inactive user account")
        
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- RBAC Test Endpoints ---

@router.get(
    "/test-analyst",
    summary="Test endpoint requiring Analyst scope"
)
def test_analyst_endpoint(
    current_user = Security(get_current_active_user, scopes=["role:analyst"])
):
    """A dummy endpoint to verify Role-Based Access Control for Analysts and Admins."""
    return {"message": f"Hello Analyst {current_user.email}! Access granted."}

@router.get(
    "/test-reviewer",
    summary="Test endpoint requiring Reviewer scope"
)
def test_reviewer_endpoint(
    current_user = Security(get_current_active_user, scopes=["role:reviewer"])
):
    """A dummy endpoint to verify Role-Based Access Control for Reviewers, Analysts, and Admins."""
    return {"message": f"Hello Reviewer {current_user.email}! Access granted."}


# --- Users Management Endpoints (US-03) ---

from uuid import UUID
from fastapi import HTTPException
from auth.infrastructure.api.schemas import UserUpdate

users_router = APIRouter(prefix="/users", tags=["Users"])

@users_router.get(
    "",
    response_model=list[UserResponse],
    summary="List all users (Admin only)"
)
def list_users(
    repository: UserRepository = Depends(get_user_repository),
    current_admin = Depends(require_admin)
):
    """Retrieve all registered users. Only accessible by Administrators."""
    return repository.get_all()

@users_router.patch(
    "/{user_id}",
    response_model=UserResponse,
    summary="Modify a user's details (Admin only)"
)
def modify_user(
    user_id: UUID,
    user_update: UserUpdate,
    repository: UserRepository = Depends(get_user_repository),
    current_admin = Depends(require_admin)
):
    """Modify details of a user account. Only accessible by Administrators."""
    user = repository.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Perform partial update by excluding unset payload values
    update_data = user_update.model_dump(exclude_unset=True)
    
    # Save target user and write event log atomically
    updated_user = repository.update_user(user, update_data, current_admin.id)
    return updated_user
