import pytest
from decimal import Decimal
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from main import app
from auth.infrastructure.db.session import get_session
from auth.infrastructure.db.models import User
from auth.infrastructure.db.models_audit import AuditLog
from auth.domain.models import UserRole
from auth.infrastructure.security.hasher import hash_password
from auth.infrastructure.security.jwt_handler import create_access_token
from catalog.domain.models import Product

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
    
    token = create_access_token(data={"sub": admin.email, "role": admin.role})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def analyst_headers(db_session: Session):
    """Seed an Analyst user and return authorization headers."""
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

@pytest.fixture
def reviewer_headers(db_session: Session):
    """Seed a Reviewer user and return authorization headers."""
    reviewer = User(
        email="reviewer@example.com",
        first_name="Data",
        last_name="Reviewer",
        role=UserRole.REVIEWER,
        hashed_password=hash_password("reviewerpassword123"),
    )
    db_session.add(reviewer)
    db_session.commit()
    db_session.refresh(reviewer)
    
    token = create_access_token(data={"sub": reviewer.email, "role": reviewer.role})
    return {"Authorization": f"Bearer {token}"}

def test_register_product_success(client: TestClient, analyst_headers: dict, db_session: Session):
    """Verify that an Analyst can register a product successfully."""
    payload = {
        "code": "PROD-001",
        "description": "Premium Ergonomic Desk Chair",
        "qty_per_box": 2,
        "exworks_price": "149.99",
        "series": "ErgoOffice",
        "shipping_route": "Maritime"
    }
    
    response = client.post("/api/v1/products", json=payload, headers=analyst_headers)
    assert response.status_code == 201
    
    data = response.json()
    assert data["code"] == "PROD-001"
    assert data["description"] == "Premium Ergonomic Desk Chair"
    assert data["qty_per_box"] == 2
    assert data["exworks_price"] == "149.99"
    assert data["series"] == "ErgoOffice"
    assert data["shipping_route"] == "Maritime"
    assert data["is_active"] is True
    assert "id" in data
    assert "created_at" in data
    
    # Verify product database persistence
    db_product = db_session.exec(select(Product).where(Product.code == "PROD-001")).first()
    assert db_product is not None
    assert db_product.description == "Premium Ergonomic Desk Chair"
    assert db_product.qty_per_box == 2
    assert db_product.exworks_price == Decimal("149.99")
    assert db_product.is_active is True
    
    # Verify audit log is written within the same transaction
    db_audit = db_session.exec(select(AuditLog).where(AuditLog.target_id == db_product.id)).first()
    assert db_audit is not None
    assert db_audit.action == "PRODUCT_CREATED"
    assert db_audit.details is not None
    assert db_audit.details["code"] == "PROD-001"

def test_register_product_by_admin(client: TestClient, admin_headers: dict, db_session: Session):
    """Verify that an Admin can register a product successfully."""
    payload = {
        "code": "PROD-002",
        "description": "Mechanical Keyboard",
        "qty_per_box": 10,
        "exworks_price": "89.50",
        "series": "Gaming",
        "shipping_route": "Air"
    }
    response = client.post("/api/v1/products", json=payload, headers=admin_headers)
    assert response.status_code == 201

def test_register_product_reviewer_forbidden(client: TestClient, reviewer_headers: dict):
    """Verify that a Reviewer cannot register a product."""
    payload = {
        "code": "PROD-003",
        "description": "Noise Cancelling Headphones",
        "qty_per_box": 5,
        "exworks_price": "199.00",
        "series": "Audio",
        "shipping_route": "Air"
    }
    response = client.post("/api/v1/products", json=payload, headers=reviewer_headers)
    assert response.status_code == 403

def test_register_product_no_token_unauthorized(client: TestClient):
    """Verify that request without a token is unauthorized."""
    payload = {
        "code": "PROD-004",
        "description": "Desk Mat",
        "qty_per_box": 20,
        "exworks_price": "15.00",
        "series": "Accessories",
        "shipping_route": "Maritime"
    }
    response = client.post("/api/v1/products", json=payload)
    assert response.status_code == 401

def test_register_product_invalid_qty(client: TestClient, analyst_headers: dict):
    """Verify validation fails if qty_per_box is <= 0."""
    payload = {
        "code": "PROD-005",
        "description": "Desk Lamp",
        "qty_per_box": 0,
        "exworks_price": "29.99",
        "series": "Lighting",
        "shipping_route": "Air"
    }
    response = client.post("/api/v1/products", json=payload, headers=analyst_headers)
    assert response.status_code == 422

def test_register_product_invalid_price(client: TestClient, analyst_headers: dict):
    """Verify validation fails if exworks_price is negative."""
    payload = {
        "code": "PROD-006",
        "description": "Desk Drawer",
        "qty_per_box": 1,
        "exworks_price": "-10.00",
        "series": "Office",
        "shipping_route": "Maritime"
    }
    response = client.post("/api/v1/products", json=payload, headers=analyst_headers)
    assert response.status_code == 422

def test_register_product_duplicate_code(client: TestClient, analyst_headers: dict, db_session: Session):
    """Verify unique constraint collision raises 409 Conflict."""
    # Register first
    product = Product(
        code="DUP-CODE",
        description="Original Chair",
        qty_per_box=1,
        exworks_price=Decimal("100.00"),
        series="Chairs",
        shipping_route="Maritime",
        is_active=True
    )
    db_session.add(product)
    db_session.commit()
    
    # Try duplicate
    payload = {
        "code": "DUP-CODE",
        "description": "Duplicate Chair",
        "qty_per_box": 2,
        "exworks_price": "120.00",
        "series": "Chairs",
        "shipping_route": "Maritime"
    }
    response = client.post("/api/v1/products", json=payload, headers=analyst_headers)
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"].lower()

def test_register_product_reactivate_inactive(client: TestClient, analyst_headers: dict, db_session: Session):
    """Verify that registering a soft-deleted product reactivates it."""
    # Register inactive product
    product = Product(
        code="INACTIVE-001",
        description="Soft-Deleted Product",
        qty_per_box=5,
        exworks_price=Decimal("50.00"),
        series="Discontinued",
        shipping_route="Maritime",
        is_active=False
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)
    
    # Register again using same code
    payload = {
        "code": "INACTIVE-001",
        "description": "Reactivated Product",
        "qty_per_box": 10,
        "exworks_price": "60.00",
        "series": "Active",
        "shipping_route": "Air"
    }
    response = client.post("/api/v1/products", json=payload, headers=analyst_headers)
    assert response.status_code == 201
    
    data = response.json()
    assert data["is_active"] is True
    assert data["description"] == "Reactivated Product"
    assert data["qty_per_box"] == 10
    assert data["exworks_price"] == "60.00"
    
    # Verify in DB
    db_session.expire_all()
    db_product = db_session.exec(select(Product).where(Product.code == "INACTIVE-001")).first()
    assert db_product.is_active is True
    assert db_product.description == "Reactivated Product"
    assert db_product.qty_per_box == 10
    assert db_product.exworks_price == Decimal("60.00")
    
    # Verify reactivation audit log was written
    db_audit = db_session.exec(select(AuditLog).where(AuditLog.target_id == db_product.id)).first()
    assert db_audit is not None
    assert db_audit.action in ("PRODUCT_CREATED", "PRODUCT_REACTIVATED")
