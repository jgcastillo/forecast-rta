from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from auth.infrastructure.db.session import get_session
from auth.infrastructure.db.repository import UserRepository
from auth.application.register_user import RegisterUser
from auth.infrastructure.api.schemas import UserCreate, UserResponse
from auth.infrastructure.api.dependencies import require_admin, get_user_repository
from auth.infrastructure.security.hasher import verify_password
from auth.infrastructure.security.jwt_handler import create_access_token
from auth.infrastructure.api.errors import UnauthorizedError

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user (Admin only)"
)
def register(
    user_in: UserCreate,
    repository: UserRepository = Depends(get_user_repository),
    current_admin = Depends(require_admin)
):
    """Register a new user account. Only accessible by Administrators."""
    use_case = RegisterUser(repository)
    new_user = use_case.execute(
        email=user_in.email,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        role=user_in.role,
        password=user_in.password
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
