import pytest
from decimal import Decimal
from fastapi.testclient import TestClient
from sqlmodel import Session
from main import app
from auth.infrastructure.db.session import get_session
from auth.infrastructure.db.models import User
from auth.domain.models import UserRole
from auth.infrastructure.security.hasher import hash_password
from auth.infrastructure.security.jwt_handler import create_access_token
from catalog.domain.models import Product

@pytest.fixture
def client(db_session: Session):
    app.dependency_overrides[get_session] = lambda: db_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def reviewer_headers(db_session: Session):
    reviewer = User(
        email="reviewer_consult@example.com",
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
def seeded_products(db_session: Session):
    products = [
        Product(code="DESK-01", description="Executive Office Desk", qty_per_box=1, exworks_price=Decimal("150.00"), series="OFFICE", shipping_route="MARITIME", is_active=True),
        Product(code="DESK-02", description="Compact Student Desk", qty_per_box=2, exworks_price=Decimal("75.50"), series="HOME", shipping_route="MARITIME", is_active=True),
        Product(code="CHAIR-01", description="Ergonomic Mesh Chair", qty_per_box=4, exworks_price=Decimal("89.90"), series="OFFICE", shipping_route="AIR", is_active=True),
        Product(code="CHAIR-02", description="Gaming Chair Pro", qty_per_box=2, exworks_price=Decimal("120.00"), series="GAMING", shipping_route="AIR", is_active=True),
        Product(code="OLD-01", description="Discontinued Table", qty_per_box=1, exworks_price=Decimal("30.00"), series="LEGACY", shipping_route="MARITIME", is_active=False),
    ]
    for p in products:
        db_session.add(p)
    db_session.commit()
    return products


def test_get_products_pagination(client: TestClient, reviewer_headers: dict, seeded_products: list):
    response = client.get("/api/v1/products?page=1&page_size=2", headers=reviewer_headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) == 2
    assert data["page"] == 1
    assert data["page_size"] == 2
    assert data["total"] == 4  # Default excludes inactive (4 active)
    assert data["total_pages"] == 2

    # Fetch page 2
    res_p2 = client.get("/api/v1/products?page=2&page_size=2", headers=reviewer_headers)
    assert res_p2.status_code == 200
    assert len(res_p2.json()["items"]) == 2


def test_get_products_search_keyword(client: TestClient, reviewer_headers: dict, seeded_products: list):
    # Search by code substring
    res1 = client.get("/api/v1/products?search=CHAIR", headers=reviewer_headers)
    assert res1.status_code == 200
    items1 = res1.json()["items"]
    assert len(items1) == 2
    assert all("CHAIR" in item["code"] for item in items1)

    # Search by description substring (case-insensitive)
    res2 = client.get("/api/v1/products?search=student", headers=reviewer_headers)
    assert res2.status_code == 200
    items2 = res2.json()["items"]
    assert len(items2) == 1
    assert items2[0]["code"] == "DESK-02"


def test_get_products_filter_series_and_route(client: TestClient, reviewer_headers: dict, seeded_products: list):
    res = client.get("/api/v1/products?series=OFFICE&shipping_route=MARITIME", headers=reviewer_headers)
    assert res.status_code == 200
    items = res.json()["items"]
    assert len(items) == 1
    assert items[0]["code"] == "DESK-01"


def test_get_products_filter_status(client: TestClient, reviewer_headers: dict, seeded_products: list):
    # Active products only (default)
    res_active = client.get("/api/v1/products?is_active=true", headers=reviewer_headers)
    assert res_active.status_code == 200
    assert res_active.json()["total"] == 4

    # Soft-deleted products only
    res_inactive = client.get("/api/v1/products?is_active=false", headers=reviewer_headers)
    assert res_inactive.status_code == 200
    assert res_inactive.json()["total"] == 1
    assert res_inactive.json()["items"][0]["code"] == "OLD-01"


def test_get_products_sorting(client: TestClient, reviewer_headers: dict, seeded_products: list):
    # Ascending price sort
    res_asc = client.get("/api/v1/products?sort_by=exworks_price&sort_order=asc", headers=reviewer_headers)
    assert res_asc.status_code == 200
    prices_asc = [float(item["exworks_price"]) for item in res_asc.json()["items"]]
    assert prices_asc == sorted(prices_asc)

    # Descending price sort
    res_desc = client.get("/api/v1/products?sort_by=exworks_price&sort_order=desc", headers=reviewer_headers)
    assert res_desc.status_code == 200
    prices_desc = [float(item["exworks_price"]) for item in res_desc.json()["items"]]
    assert prices_desc == sorted(prices_desc, reverse=True)


def test_get_products_unauthenticated(client: TestClient):
    response = client.get("/api/v1/products")
    assert response.status_code == 401
