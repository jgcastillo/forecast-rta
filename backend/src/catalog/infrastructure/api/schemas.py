from decimal import Decimal
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from pydantic import Field, field_validator, field_serializer
from sqlmodel import SQLModel
from catalog.domain.models import ProductBase

class ProductCreate(SQLModel):
    code: str
    description: str
    qty_per_box: int = Field(gt=0)
    exworks_price: Decimal = Field(ge=0, max_digits=10, decimal_places=2)
    series: str
    shipping_route: str

    @field_validator("code", "description", "series", "shipping_route")
    @classmethod
    def validate_strings_not_empty(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Field cannot be empty or only spaces")
        return trimmed

class ProductUpdate(SQLModel):
    code: Optional[str] = None
    description: Optional[str] = None
    qty_per_box: Optional[int] = Field(default=None, gt=0)
    exworks_price: Optional[Decimal] = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    series: Optional[str] = None
    shipping_route: Optional[str] = None
    is_active: Optional[bool] = None

    @field_validator("code", "description", "series", "shipping_route")
    @classmethod
    def validate_optional_strings_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            trimmed = v.strip()
            if not trimmed:
                raise ValueError("Field cannot be empty or only spaces")
            return trimmed
        return v

class ProductFilterParams(SQLModel):
    search: Optional[str] = None
    series: Optional[str] = None
    shipping_route: Optional[str] = None
    is_active: Optional[bool] = True
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
    sort_by: str = Field(default="code")
    sort_order: str = Field(default="asc")

class ProductResponse(ProductBase):
    id: UUID
    created_at: datetime

    @field_serializer("exworks_price")
    def serialize_price(self, price: Decimal) -> str:
        return f"{price:.2f}"

class PaginatedProductResponse(SQLModel):
    items: List[ProductResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
