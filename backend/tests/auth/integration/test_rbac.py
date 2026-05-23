import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session
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

def generate_headers(email: str, role: UserRole, db_session: Session) -> dict:
    """Helper to seed a user and generate authorization headers."""
    user = User(
        email=email,
        first_name="Test",
        last_name="User",
        role=role,
        hashed_password=hash_password("password123"),
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    # Token payload contains the email and the role
    token = create_access_token(data={"sub": user.email, "role": user.role})
    return {"Authorization": f"Bearer {token}"}

def test_rbac_admin_access(client: TestClient, db_session: Session):
    """Verify that an Administrator has access to all protected endpoints."""
    headers = generate_headers("admin_rbac@example.com", UserRole.ADMIN, db_session)
    
    resp1 = client.get("/auth/test-analyst", headers=headers)
    assert resp1.status_code == 200
    
    resp2 = client.get("/auth/test-reviewer", headers=headers)
    assert resp2.status_code == 200

def test_rbac_analyst_access(client: TestClient, db_session: Session):
    """Verify that an Analyst has access to Analyst and Reviewer endpoints, but not Admin endpoints if restricted."""
    headers = generate_headers("analyst_rbac@example.com", UserRole.ANALYST, db_session)
    
    resp1 = client.get("/auth/test-analyst", headers=headers)
    assert resp1.status_code == 200
    
    resp2 = client.get("/auth/test-reviewer", headers=headers)
    assert resp2.status_code == 200

def test_rbac_reviewer_access(client: TestClient, db_session: Session):
    """Verify that a Reviewer can access Reviewer endpoints but is forbidden from Analyst endpoints."""
    headers = generate_headers("reviewer_rbac@example.com", UserRole.REVIEWER, db_session)
    
    # Analyst endpoint must be Forbidden for Reviewer
    resp1 = client.get("/auth/test-analyst", headers=headers)
    assert resp1.status_code == 403
    
    # Reviewer endpoint must be allowed
    resp2 = client.get("/auth/test-reviewer", headers=headers)
    assert resp2.status_code == 200
