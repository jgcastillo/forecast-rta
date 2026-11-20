from decimal import Decimal
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, CheckConstraint

class ProductBase(SQLModel):
    code: str = Field(index=True, unique=True, nullable=False, max_length=100)
    description: str = Field(nullable=False)
    qty_per_box: int = Field(default=1, nullable=False)
    exworks_price: Decimal = Field(default=Decimal("0.00"), nullable=False, max_digits=10, decimal_places=2)
    series: str = Field(nullable=False, max_length=50)
    shipping_route: str = Field(default="Marítimo", nullable=False, max_length=20)
    
    # Extended attributes from Stakeholder Excel
    mps_per_box: Optional[int] = Field(default=None, nullable=True)
    category_type: Optional[str] = Field(default=None, max_length=50, nullable=True)
    press_model: Optional[str] = Field(default=None, max_length=50, nullable=True)
    notes: Optional[str] = Field(default=None, nullable=True)
    is_active: bool = Field(default=True, nullable=False)

class Product(ProductBase, table=True):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("qty_per_box > 0", name="check_qty_per_box_positive"),
        CheckConstraint("exworks_price >= 0", name="check_exworks_price_non_negative"),
        CheckConstraint("mps_per_box IS NULL OR mps_per_box > 0", name="check_mps_per_box_positive"),
        CheckConstraint(
            "shipping_route IN ('Marítimo', 'Aéreo', 'Maritime', 'Air', 'MARITIME', 'AIR')",
            name="check_shipping_route_valid"
        ),
    )
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at: Optional[datetime] = Field(default=None, nullable=True)
