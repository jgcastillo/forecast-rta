from decimal import Decimal
from uuid import UUID
from datetime import datetime
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

class ProductResponse(ProductBase):
    id: UUID
    created_at: datetime

    @field_serializer("exworks_price")
    def serialize_price(self, price: Decimal) -> str:
        return f"{price:.2f}"

