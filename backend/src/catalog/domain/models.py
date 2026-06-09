from decimal import Decimal
from uuid import UUID, uuid4
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, CheckConstraint

class ProductBase(SQLModel):
    code: str = Field(index=True, unique=True, nullable=False)
    description: str = Field(nullable=False)
    qty_per_box: int = Field(nullable=False)
    exworks_price: Decimal = Field(nullable=False, max_digits=10, decimal_places=2)
    series: str = Field(nullable=False)
    shipping_route: str = Field(nullable=False)
    is_active: bool = Field(default=True, nullable=False)

class Product(ProductBase, table=True):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("qty_per_box > 0", name="check_qty_per_box_positive"),
        CheckConstraint("exworks_price >= 0", name="check_exworks_price_non_negative"),
    )
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )
