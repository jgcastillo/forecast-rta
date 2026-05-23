import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from main import app
from auth.infrastructure.db.session import get_session
from auth.infrastructure.db.models import User
from auth.domain.models import UserRole
from auth.infrastructure.security.hasher import hash_password
from auth.infrastructure.security.jwt_handler import create_access_token

@pytest.fixture
def client(db_session: Session):
    """Override get_session dependency and yield TestClient."""
    app.dependency_overrides[get_session] = lambda: db_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def admin_headers(db_session: Session):
    """Seed an Admin user and return authorization headers."""
    admin = User(
        email="admin@example.com",
        first_name="System",
        last_name="Admin",
        role=UserRole.ADMIN,
        hashed_password=hash_password("adminpassword123"),
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    
    # Generate token with sub (subject) and role claims
    token = create_access_token(data={"sub": admin.email, "role": admin.role})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def analyst_headers(db_session: Session):
    """Seed an Analyst user and return authorization headers (unauthorized for registration)."""
    analyst = User(
        email="analyst@example.com",
        first_name="Data",
        last_name="Analyst",
        role=UserRole.ANALYST,
        hashed_password=hash_password("analystpassword123"),
    )
    db_session.add(analyst)
    db_session.commit()
    db_session.refresh(analyst)
    
    token = create_access_token(data={"sub": analyst.email, "role": analyst.role})
    return {"Authorization": f"Bearer {token}"}

def test_register_user_success(client: TestClient, admin_headers: dict, db_session: Session):
    """Verify that an Admin can register a new user successfully."""
    payload = {
        "email": "new.user@example.com",
        "first_name": "New",
        "last_name": "User",
        "role": "Analyst",
        "password": "temporary_password123"
    }
    
    response = client.post("/auth/register", json=payload, headers=admin_headers)
    assert response.status_code == 201
    
    data = response.json()
    assert data["email"] == "new.user@example.com"
    assert data["first_name"] == "New"
    assert data["last_name"] == "User"
    assert data["role"] == "Analyst"
    assert "id" in data
    assert "created_at" in data
    assert "password" not in data
    assert "hashed_password" not in data
    
    # Verify database persistence
    db_user = db_session.exec(select(User).where(User.email == "new.user@example.com")).first()
    assert db_user is not None
    assert db_user.first_name == "New"
    assert db_user.last_name == "User"
    assert db_user.role == UserRole.ANALYST
    assert db_user.hashed_password != "temporary_password123"  # Must be hashed

def test_register_user_email_conflict(client: TestClient, admin_headers: dict, db_session: Session):
    """Verify that registering an email that already exists returns a 409 Conflict."""
    # Register first user
    payload = {
        "email": "conflict@example.com",
        "first_name": "Conflict",
        "last_name": "User",
        "role": "Reviewer",
        "password": "password123"
    }
    
    response1 = client.post("/auth/register", json=payload, headers=admin_headers)
    assert response1.status_code == 201
    
    # Try registering again with the same email
    response2 = client.post("/auth/register", json=payload, headers=admin_headers)
    assert response2.status_code == 409
    assert "already registered" in response2.json()["detail"].lower()

def test_register_user_unauthorized_non_admin(client: TestClient, analyst_headers: dict):
    """Verify that a non-admin (e.g., Analyst) cannot register new users."""
    payload = {
        "email": "forbidden@example.com",
        "first_name": "Forbidden",
        "last_name": "User",
        "role": "Reviewer",
        "password": "password123"
    }
    
    response = client.post("/auth/register", json=payload, headers=analyst_headers)
    assert response.status_code == 403

def test_register_user_unauthorized_no_token(client: TestClient):
    """Verify that requests without authorization tokens are rejected."""
    payload = {
        "email": "unauthorized@example.com",
        "first_name": "No",
        "last_name": "Token",
        "role": "Reviewer",
        "password": "password123"
    }
    
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 401

def test_register_user_invalid_input(client: TestClient, admin_headers: dict):
    """Verify that invalid inputs return 422 Unprocessable Entity."""
    # Invalid email
    payload_bad_email = {
        "email": "not-an-email",
        "first_name": "Bad",
        "last_name": "Email",
        "role": "Analyst",
        "password": "password123"
    }
    response = client.post("/auth/register", json=payload_bad_email, headers=admin_headers)
    assert response.status_code == 422
    
    # Empty first name
    payload_bad_name = {
        "email": "valid@example.com",
        "first_name": "",
        "last_name": "Doe",
        "role": "Analyst",
        "password": "password123"
    }
    response = client.post("/auth/register", json=payload_bad_name, headers=admin_headers)
    assert response.status_code == 422
