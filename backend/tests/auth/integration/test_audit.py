from uuid import UUID
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

def test_audit_log_created_on_registration(client: TestClient, db_session: Session):
    """Verify that user registration creates a matching audit log record."""
    # 1. Seed admin actor
    admin = User(
        email="admin_audit@example.com",
        first_name="Admin",
        last_name="User",
        role=UserRole.ADMIN,
        hashed_password=hash_password("adminpass123"),
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    
    # 2. Get authorization token for admin
    token = create_access_token(data={"sub": admin.email, "role": admin.role})
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Register target user
    payload = {
        "email": "audited.user@example.com",
        "first_name": "Audit",
        "last_name": "Target",
        "role": "Analyst",
        "password": "password123"
    }
    resp = client.post("/auth/register", json=payload, headers=headers)
    assert resp.status_code == 201
    new_user_id = resp.json()["id"]
    
    # 4. Assert audit log record exists and maps correctly
    audit_records = db_session.exec(select(AuditLog).where(AuditLog.target_id == UUID(new_user_id))).all()
    assert len(audit_records) == 1
    
    audit = audit_records[0]
    assert str(audit.actor_id) == str(admin.id)
    assert str(audit.target_id) == str(new_user_id)
    assert audit.action == "USER_REGISTRATION"
    assert audit.created_at is not None
