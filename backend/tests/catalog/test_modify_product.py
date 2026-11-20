import pytest
from uuid import uuid4
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
    admin = User(
        email="admin_mod@example.com",
        first_name="Admin",
        last_name="User",
        role=UserRole.ADMIN,
        hashed_password=hash_password("adminpass123"),
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    token = create_access_token(data={"sub": admin.email, "role": admin.role})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def analyst_headers(db_session: Session):
    analyst = User(
        email="analyst_mod@example.com",
        first_name="Analyst",
        last_name="User",
        role=UserRole.ANALYST,
        hashed_password=hash_password("analystpass123"),
    )
    db_session.add(analyst)
    db_session.commit()
    db_session.refresh(analyst)
    token = create_access_token(data={"sub": analyst.email, "role": analyst.role})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def reviewer_headers(db_session: Session):
    reviewer = User(
        email="reviewer_mod@example.com",
        first_name="Reviewer",
        last_name="User",
        role=UserRole.REVIEWER,
        hashed_password=hash_password("reviewerpass123"),
    )
    db_session.add(reviewer)
    db_session.commit()
    db_session.refresh(reviewer)
    token = create_access_token(data={"sub": reviewer.email, "role": reviewer.role})
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def sample_product(db_session: Session) -> Product:
    product = Product(
        code="MOD-001",
        description="Original Chair",
        qty_per_box=4,
        exworks_price=Decimal("49.99"),
        series="COMFORT",
        shipping_route="MARITIME",
        is_active=True,
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)
    return product


def test_update_product_success(client: TestClient, db_session: Session, analyst_headers: dict, sample_product: Product):
    payload = {
        "description": "Updated Ergonomic Chair",
        "exworks_price": 59.99,
        "qty_per_box": 6,
    }
    response = client.patch(f"/api/v1/products/{sample_product.id}", json=payload, headers=analyst_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["description"] == "Updated Ergonomic Chair"
    assert data["exworks_price"] == "59.99"
    assert data["qty_per_box"] == 6
    assert data["code"] == "MOD-001"  # Unchanged

    # Verify AuditLog entry created
    audit = db_session.exec(select(AuditLog).where(AuditLog.target_id == sample_product.id, AuditLog.action == "PRODUCT_UPDATED")).first()
    assert audit is not None
    assert audit.details["description"] == "Updated Ergonomic Chair"


def test_update_product_code_duplicate(client: TestClient, db_session: Session, analyst_headers: dict, sample_product: Product):
    p2 = Product(
        code="MOD-002",
        description="Second Product",
        qty_per_box=2,
        exworks_price=Decimal("15.00"),
        series="BASIC",
        shipping_route="AIR",
        is_active=True,
    )
    db_session.add(p2)
    db_session.commit()

    # Attempt to change p2's code to MOD-001
    response = client.patch(f"/api/v1/products/{p2.id}", json={"code": "MOD-001"}, headers=analyst_headers)
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"]


def test_update_product_same_code(client: TestClient, analyst_headers: dict, sample_product: Product):
    # Updating with the exact same code should succeed
    response = client.patch(f"/api/v1/products/{sample_product.id}", json={"code": "MOD-001", "description": "Same SKU"}, headers=analyst_headers)
    assert response.status_code == 200
    assert response.json()["description"] == "Same SKU"


def test_update_product_invalid_values(client: TestClient, analyst_headers: dict, sample_product: Product):
    # Invalid qty_per_box <= 0
    res1 = client.patch(f"/api/v1/products/{sample_product.id}", json={"qty_per_box": 0}, headers=analyst_headers)
    assert res1.status_code == 422

    # Negative exworks_price
    res2 = client.patch(f"/api/v1/products/{sample_product.id}", json={"exworks_price": -10.00}, headers=analyst_headers)
    assert res2.status_code == 422

    # Empty string
    res3 = client.patch(f"/api/v1/products/{sample_product.id}", json={"description": "   "}, headers=analyst_headers)
    assert res3.status_code == 422


def test_update_nonexistent_product(client: TestClient, analyst_headers: dict):
    random_id = uuid4()
    response = client.patch(f"/api/v1/products/{random_id}", json={"description": "Ghost"}, headers=analyst_headers)
    assert response.status_code == 404


def test_deactivate_product(client: TestClient, db_session: Session, analyst_headers: dict, sample_product: Product):
    response = client.patch(f"/api/v1/products/{sample_product.id}", json={"is_active": False}, headers=analyst_headers)
    assert response.status_code == 200
    assert response.json()["is_active"] is False

    audit = db_session.exec(select(AuditLog).where(AuditLog.target_id == sample_product.id, AuditLog.action == "PRODUCT_DEACTIVATED")).first()
    assert audit is not None


def test_update_product_rbac(client: TestClient, reviewer_headers: dict, sample_product: Product):
    # Reviewer should be forbidden from modifying product
    response = client.patch(f"/api/v1/products/{sample_product.id}", json={"description": "Hacked"}, headers=reviewer_headers)
    assert response.status_code == 403
