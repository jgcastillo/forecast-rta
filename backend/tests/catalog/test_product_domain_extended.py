import pytest
from decimal import Decimal
from datetime import datetime, timezone
from fastapi.testclient import TestClient
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError
from main import app
from auth.infrastructure.db.session import get_session
from auth.infrastructure.db.models import User
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
def analyst_headers(db_session: Session):
    """Seed an Analyst user and return authorization headers."""
    analyst = User(
        email="analyst_ext@example.com",
        first_name="Catalog",
        last_name="Analyst",
        role=UserRole.ANALYST,
        hashed_password=hash_password("analystpassword123"),
    )
    db_session.add(analyst)
    db_session.commit()
    db_session.refresh(analyst)
    
    token = create_access_token(data={"sub": analyst.email, "role": analyst.role})
    return {"Authorization": f"Bearer {token}"}

# =========================================================================
# Unit / Domain Tests: Extended Model Fields & Defaults
# =========================================================================

def test_product_extended_fields_instantiation():
    """Verify Product entity instantiates with all real operational attributes from Excel."""
    now = datetime.now(timezone.utc)
    product = Product(
        code="Q4210D",
        description="HIGH CONCENTRATION ElectroInk YELLOW FOR 1X000",
        qty_per_box=2,
        exworks_price=Decimal("698.47"),
        series="SERIE 4",
        shipping_route="Marítimo",
        mps_per_box=2,
        category_type="IP",
        press_model="10K",
        notes="Tener 25 en stock de seguridad",
        updated_at=now,
        is_active=True,
    )
    assert product.code == "Q4210D"
    assert product.series == "SERIE 4"
    assert product.mps_per_box == 2
    assert product.category_type == "IP"
    assert product.press_model == "10K"
    assert product.notes == "Tener 25 en stock de seguridad"
    assert product.updated_at == now
    assert product.shipping_route == "Marítimo"

def test_product_extended_defaults_backward_compatibility():
    """Verify that omitting optional extended attributes defaults them to None/safe values."""
    product = Product(
        code="MICH-DP680",
        description="MICHELMAN PRIMER 680 (44Lb BOX 4 X 11L)",
        qty_per_box=4,
        exworks_price=Decimal("270.60"),
        series="SPECIAL",
        shipping_route="Marítimo"
    )
    assert product.mps_per_box is None
    assert product.category_type is None
    assert product.press_model is None
    assert product.notes is None
    assert product.updated_at is None
    assert product.is_active is True

# =========================================================================
# Integration Tests: DB Persistence & Constraints
# =========================================================================

def test_product_extended_database_persistence(db_session: Session):
    """Verify extended product persists and retrieves properly from PostgreSQL / SQLite."""
    product = Product(
        code="Q4284D",
        description="HP INDIGO ELECTROINK YELLOW HIGH CONCENTRATION X 20000",
        qty_per_box=2,
        exworks_price=Decimal("698.47"),
        series="SERIE 4",
        shipping_route="Aéreo",
        mps_per_box=2,
        category_type="IP",
        press_model="20K",
        notes="Consumo critico",
        is_active=True
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)
    
    saved = db_session.exec(select(Product).where(Product.code == "Q4284D")).first()
    assert saved is not None
    assert saved.mps_per_box == 2
    assert saved.category_type == "IP"
    assert saved.press_model == "20K"
    assert saved.notes == "Consumo critico"
    assert saved.shipping_route == "Aéreo"

def test_product_check_constraint_mps_positive(db_session: Session):
    """Verify that mps_per_box <= 0 violates database check constraint."""
    product = Product(
        code="INVALID-MPS",
        description="Invalid MPS Product",
        qty_per_box=1,
        exworks_price=Decimal("10.00"),
        series="SERIE 4",
        shipping_route="Marítimo",
        mps_per_box=0  # Invalid! Must be > 0
    )
    db_session.add(product)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

def test_product_check_constraint_shipping_route_invalid(db_session: Session):
    """Verify that shipping_route outside ('Marítimo', 'Aéreo') violates check constraint."""
    product = Product(
        code="INVALID-ROUTE",
        description="Invalid Route Product",
        qty_per_box=1,
        exworks_price=Decimal("10.00"),
        series="SERIE 2",
        shipping_route="Espacial"  # Invalid!
    )
    db_session.add(product)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

# =========================================================================
# API Integration Tests: Product Registration with Extended Attributes
# =========================================================================

def test_api_register_product_with_extended_fields(client: TestClient, analyst_headers: dict):
    """Verify POST /api/v1/products accepts and returns extended attributes."""
    payload = {
        "code": "API-EXT-001",
        "description": "Extended API Product",
        "qty_per_box": 5,
        "exworks_price": "250.00",
        "series": "SERIE 4",
        "shipping_route": "Marítimo",
        "mps_per_box": 5,
        "category_type": "OMP",
        "press_model": "BOTH",
        "notes": "Alerta de compra"
    }
    response = client.post("/api/v1/products", json=payload, headers=analyst_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["code"] == "API-EXT-001"
    assert data["mps_per_box"] == 5
    assert data["category_type"] == "OMP"
    assert data["press_model"] == "BOTH"
    assert data["notes"] == "Alerta de compra"

def test_api_register_product_backward_compatible_without_extended_fields(client: TestClient, analyst_headers: dict):
    """Verify POST /api/v1/products still succeeds when extended attributes are omitted."""
    payload = {
        "code": "API-LEGACY-001",
        "description": "Legacy Payload Product",
        "qty_per_box": 1,
        "exworks_price": "99.99",
        "series": "SERIE 2",
        "shipping_route": "Marítimo"
    }
    response = client.post("/api/v1/products", json=payload, headers=analyst_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["code"] == "API-LEGACY-001"
    assert data.get("mps_per_box") is None
    assert data.get("category_type") is None
    assert data.get("press_model") is None
    assert data.get("notes") is None
