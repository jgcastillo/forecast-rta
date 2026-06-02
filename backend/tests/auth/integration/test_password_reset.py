import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from main import app
from auth.infrastructure.db.session import get_session
from auth.infrastructure.db.models import User
from auth.domain.models import UserRole
from auth.infrastructure.security.hasher import hash_password, verify_password
from auth.infrastructure.security.jwt_handler import create_password_reset_token, decode_access_token
from auth.infrastructure.db.models_audit import AuditLog

@pytest.fixture
def client(db_session: Session):
    """Override get_session dependency and yield TestClient."""
    app.dependency_overrides[get_session] = lambda: db_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def seed_user(email: str, db_session: Session) -> User:
    """Helper to seed a test user."""
    user = User(
        email=email,
        first_name="Reset",
        last_name="User",
        role=UserRole.ANALYST,
        hashed_password=hash_password("oldpassword123"),
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user

def test_password_recovery_request_success(client: TestClient, db_session: Session):
    """Verify that requesting password recovery returns a success response for existing user."""
    user = seed_user("recovery_exist@example.com", db_session)
    
    resp = client.post(f"/api/v1/auth/password-recovery/{user.email}")
    assert resp.status_code == 200
    assert "detail" in resp.json()
    assert "reset link has been generated" in resp.json()["detail"]

def test_password_recovery_request_non_existent(client: TestClient):
    """Verify that requesting recovery for non-existent user returns success to prevent enumeration."""
    resp = client.post("/api/v1/auth/password-recovery/nonexistent@example.com")
    assert resp.status_code == 200
    assert "detail" in resp.json()
    assert "reset link has been generated" in resp.json()["detail"]

def test_reset_password_success(client: TestClient, db_session: Session):
    """Verify that resetting a password with a valid token updates the password and logs the audit event."""
    user = seed_user("reset_success@example.com", db_session)
    
    # Generate valid token
    token = create_password_reset_token(user.email)
    
    payload = {
        "token": token,
        "new_password": "newpassword123"
    }
    
    resp = client.post("/api/v1/auth/reset-password", json=payload)
    assert resp.status_code == 200
    assert "detail" in resp.json()
    assert "successfully" in resp.json()["detail"].lower()
    
    # Verify password was updated in DB
    db_session.expire_all()
    updated_user = db_session.get(User, user.id)
    assert verify_password("newpassword123", updated_user.hashed_password)
    assert not verify_password("oldpassword123", updated_user.hashed_password)
    
    # Verify audit log was created
    audit_records = db_session.exec(
        select(AuditLog)
        .where(AuditLog.target_id == user.id)
        .where(AuditLog.action == "PASSWORD_RESET")
    ).all()
    assert len(audit_records) == 1
    assert audit_records[0].actor_id == user.id

def test_reset_password_invalid_token(client: TestClient, db_session: Session):
    """Verify that resetting password with an invalid token returns 401 Unauthorized."""
    payload = {
        "token": "invalid_token_signature_here",
        "new_password": "newpassword123"
    }
    resp = client.post("/api/v1/auth/reset-password", json=payload)
    assert resp.status_code == 401
    assert "detail" in resp.json()

def test_reset_password_weak_password(client: TestClient, db_session: Session):
    """Verify that resetting password with a weak password fails validation."""
    user = seed_user("reset_weak@example.com", db_session)
    token = create_password_reset_token(user.email)
    
    # Weak password: no number
    payload = {
        "token": token,
        "new_password": "weakpassword"
    }
    resp = client.post("/api/v1/auth/reset-password", json=payload)
    assert resp.status_code == 422
