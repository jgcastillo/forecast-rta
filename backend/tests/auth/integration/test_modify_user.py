import uuid
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from main import app
from auth.infrastructure.db.session import get_session
from auth.infrastructure.db.models import User
from auth.domain.models import UserRole
from auth.infrastructure.security.hasher import hash_password
from auth.infrastructure.security.jwt_handler import create_access_token
from auth.infrastructure.db.models_audit import AuditLog

@pytest.fixture
def client(db_session: Session):
    """Override get_session dependency and yield TestClient."""
    app.dependency_overrides[get_session] = lambda: db_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def generate_headers(email: str, role: UserRole, db_session: Session) -> tuple[User, dict]:
    """Helper to seed a user and generate authorization headers, returning user and headers."""
    user = User(
        email=email,
        first_name="Actor",
        last_name="User",
        role=role,
        hashed_password=hash_password("password123"),
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    token = create_access_token(data={"sub": user.email, "role": user.role})
    return user, {"Authorization": f"Bearer {token}"}

def test_modify_user_success_admin(client: TestClient, db_session: Session):
    """Verify that an Admin can update another user and that an audit log is created with details."""
    admin, headers = generate_headers("admin_update@example.com", UserRole.ADMIN, db_session)
    
    # Seed target user
    target_user = User(
        email="target@example.com",
        first_name="OriginalName",
        last_name="LastName",
        role=UserRole.ANALYST,
        hashed_password=hash_password("password123"),
    )
    db_session.add(target_user)
    db_session.commit()
    db_session.refresh(target_user)
    
    payload = {
        "first_name": "UpdatedName",
        "role": "Reviewer",
        "is_active": False
    }
    
    resp = client.patch(f"/api/v1/users/{target_user.id}", json=payload, headers=headers)
    assert resp.status_code == 200
    
    data = resp.json()
    assert data["first_name"] == "UpdatedName"
    assert data["role"] == "Reviewer"
    assert data["is_active"] is False
    assert data["last_name"] == "LastName"  # Unchanged
    
    # Assert database state
    db_session.expire_all()
    updated_db_user = db_session.get(User, target_user.id)
    assert updated_db_user.first_name == "UpdatedName"
    assert updated_db_user.role == UserRole.REVIEWER
    assert updated_db_user.is_active is False
    
    # Assert audit log details
    audit_records = db_session.exec(
        select(AuditLog)
        .where(AuditLog.target_id == target_user.id)
        .where(AuditLog.action == "USER_UPDATED")
    ).all()
    assert len(audit_records) == 1
    audit = audit_records[0]
    assert audit.actor_id == admin.id
    assert audit.details == {"first_name": "UpdatedName", "role": "Reviewer", "is_active": False}

def test_modify_user_forbidden_non_admin(client: TestClient, db_session: Session):
    """Verify that non-admin requests to modify a user are rejected with 403 Forbidden."""
    analyst, headers = generate_headers("analyst_update@example.com", UserRole.ANALYST, db_session)
    
    # Seed target user
    target_user = User(
        email="target2@example.com",
        first_name="OriginalName",
        last_name="LastName",
        role=UserRole.ANALYST,
        hashed_password=hash_password("password123"),
    )
    db_session.add(target_user)
    db_session.commit()
    
    payload = {"first_name": "UpdatedName"}
    
    resp = client.patch(f"/api/v1/users/{target_user.id}", json=payload, headers=headers)
    assert resp.status_code == 403

def test_modify_user_not_found(client: TestClient, db_session: Session):
    """Verify that updating a non-existent user returns 404 Not Found."""
    admin, headers = generate_headers("admin_notfound@example.com", UserRole.ADMIN, db_session)
    
    non_existent_id = uuid.uuid4()
    payload = {"first_name": "UpdatedName"}
    
    resp = client.patch(f"/api/v1/users/{non_existent_id}", json=payload, headers=headers)
    assert resp.status_code == 404

def test_get_users_success(client: TestClient, db_session: Session):
    """Verify that an Admin can list all users in the system."""
    admin, headers = generate_headers("admin_list@example.com", UserRole.ADMIN, db_session)
    
    resp = client.get("/api/v1/users", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 1
    # Check that it contains the seeded admin
    emails = [u["email"] for u in data]
    assert "admin_list@example.com" in emails

def test_get_users_forbidden(client: TestClient, db_session: Session):
    """Verify that a non-admin is forbidden from listing users."""
    analyst, headers = generate_headers("analyst_list@example.com", UserRole.ANALYST, db_session)
    
    resp = client.get("/api/v1/users", headers=headers)
    assert resp.status_code == 403
