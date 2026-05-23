import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
from main import app
from auth.infrastructure.db.session import get_session
from auth.infrastructure.db.models import User
from auth.domain.models import UserRole
from auth.infrastructure.security.hasher import hash_password

@pytest.fixture
def client(db_session: Session):
    """Override get_session dependency and yield TestClient."""
    app.dependency_overrides[get_session] = lambda: db_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def test_login_success(client: TestClient, db_session: Session):
    # Seed active user
    hashed = hash_password("secretpass123")
    user = User(
        email="testlogin@example.com",
        first_name="Test",
        last_name="User",
        role=UserRole.ANALYST,
        hashed_password=hashed,
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Login
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "testlogin@example.com", "password": "secretpass123"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_incorrect_password(client: TestClient, db_session: Session):
    # Seed active user
    hashed = hash_password("secretpass123")
    user = User(
        email="testlogin@example.com",
        first_name="Test",
        last_name="User",
        role=UserRole.ANALYST,
        hashed_password=hashed,
        is_active=True
    )
    db_session.add(user)
    db_session.commit()

    # Login with wrong password
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "testlogin@example.com", "password": "wrongpassword"}
    )
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

def test_login_non_existent_email(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "doesnotexist@example.com", "password": "password"}
    )
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

def test_login_inactive_user(client: TestClient, db_session: Session):
    # Seed inactive user
    hashed = hash_password("secretpass123")
    user = User(
        email="inactive@example.com",
        first_name="Inactive",
        last_name="User",
        role=UserRole.ANALYST,
        hashed_password=hashed,
        is_active=False
    )
    db_session.add(user)
    db_session.commit()

    # Login with inactive user
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "inactive@example.com", "password": "secretpass123"}
    )
    
    assert response.status_code == 403
    assert response.json()["detail"] == "Inactive user account"
