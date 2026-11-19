# Data Model: Product Catalog Refinement & Seeding (US-05a)

**Module**: 02_catalog  
**Feature**: US05_a_data_model  
**Date**: 2026-11-19  
**Status**: Specification (Draft)  
**Storage**: PostgreSQL (Containerized) via SQLModel (ORM)

---

## 1. Domain Overview & Purpose

This document defines the formal Single Source of Truth (SSOT) for the **Product** domain model within the `02_catalog` module.

The model is refined directly from the real operational sheets provided by stakeholders:
1. `docs/originals/Forecast Serie 2-3 al 28-2-26B_202603.xlsx` (`Analisis S2 S3`)
2. `docs/originals/Forecast Serie 4 28-2-26 -v2_202603.xlsx` (`Analisis S4`)

It captures the complete lifecycle, packaging, machine compatibility, pricing, and operational observations of ~140 unique products across Series 2, 3, 4, and Special Consumables.

---

## 2. Entity Specification: `Product`

### 2.1 Attribute Schema

| Field | Python Type | DB Column | DB Type | Nullable | Constraints & Defaults | Business Purpose / Excel Origin |
|:---|:---|:---|:---|:---:|:---|:---|
| `id` | `uuid.UUID` | `id` | `UUID` | No | PK, Default: `uuid4()` | System surrogate key |
| `code` | `str` | `code` | `VARCHAR(100)` | No | UNIQUE, INDEX, Uppercase, Trimmed | Part Number / SKU (Column `CODIGO` / `PN`) |
| `description` | `str` | `description` | `TEXT` | No | Trimmed | Product name (Column `CONSUMIBLES`) |
| `series` | `str` | `series` | `VARCHAR(50)` | No | Enum/String: `SERIE 2`, `SERIE 3`, `SERIE 4`, `SPECIAL` | Equipment generation (Derived from sheet sections) |
| `qty_per_box` | `int` | `qty_per_box` | `INTEGER` | No | Default: `1`, Check: `> 0` | Packaging factor (Column `Cdad. x caja`; handles "NO SUPPLIES" as 1) |
| `exworks_price`| `Decimal` | `exworks_price` | `NUMERIC(10,2)`| No | Default: `0.00`, Check: `>= 0` | Base purchase price in USD (Column `Exworks`) |
| `shipping_route`| `str` | `shipping_route` | `VARCHAR(20)` | No | Default: `'Marítimo'`, Check in `('Marítimo', 'Aéreo')` | Target transit time: Marítimo (5m), Aéreo (3.5m) |
| `mps_per_box` | `Optional[int]` | `mps_per_box` | `INTEGER` | Yes | Default: `None`, Check: `> 0` | MPS packaging units (Column `MPS` in Serie 4) |
| `category_type`| `Optional[str]` | `category_type` | `VARCHAR(50)` | Yes | Default: `None` | Material type: `IP` (Imaging Products), `OMP` (Parts) |
| `press_model` | `Optional[str]` | `press_model` | `VARCHAR(50)` | Yes | Default: `None` | Target press: `10K`, `20K`, `BOTH` (Serie 4) |
| `notes` | `Optional[str]` | `notes` | `TEXT` | Yes | Default: `None` | Operational alerts (Column `OBSERVACIONES`, e.g., "Tener 25") |
| `is_active` | `bool` | `is_active` | `BOOLEAN` | No | Default: `True` | Soft-delete / active status |
| `created_at` | `datetime` | `created_at` | `TIMESTAMPTZ` | No | Default: `datetime.now(timezone.utc)` | Audit creation timestamp |
| `updated_at` | `Optional[datetime]`| `updated_at` | `TIMESTAMPTZ` | Yes | Default: `None` | Audit update timestamp |

### 2.2 Table Constraints

```sql
CONSTRAINT check_qty_per_box_positive CHECK (qty_per_box > 0)
CONSTRAINT check_exworks_price_non_negative CHECK (exworks_price >= 0)
CONSTRAINT check_mps_per_box_positive CHECK (mps_per_box IS NULL OR mps_per_box > 0)
CONSTRAINT check_shipping_route_valid CHECK (shipping_route IN ('Marítimo', 'Aéreo'))
```

---

## 3. Data Transfer Objects (DTOs) & Contracts

### 3.1 Pydantic / SQLModel Contracts

```python
from decimal import Decimal
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, CheckConstraint

class ProductBase(SQLModel):
    code: str = Field(index=True, unique=True, nullable=False, max_length=100)
    description: str = Field(nullable=False)
    series: str = Field(nullable=False, max_length=50)
    qty_per_box: int = Field(default=1, nullable=False)
    exworks_price: Decimal = Field(default=Decimal("0.00"), max_digits=10, decimal_places=2, nullable=False)
    shipping_route: str = Field(default="Marítimo", max_length=20, nullable=False)
    
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
        CheckConstraint("shipping_route IN ('Marítimo', 'Aéreo')", name="check_shipping_route_valid"),
    )
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at: Optional[datetime] = Field(default=None, nullable=True)
```

---

## 4. Excel Mapping Rules (ETL Normalization)

### 4.1 File: `Forecast Serie 2-3 al 28-2-26B_202603.xlsx` (Sheet: `Analisis S2 S3`)

| Source Column / Row | Target Field | Transformation Rule |
|:---|:---|:---|
| Column `B` (`CODIGO`) | `Product.code` | Trim spaces, uppercase. Filter out headers (`CODIGO`, `VERIFICADO`, `TOTAL`). |
| Column `C` (`CONSUMIBLES`) | `Product.description` | Trim spaces. Skip row if empty. |
| Section Header (`Row 16-24`, `25-87`, `88-151`) | `Product.series` | `Row 16-24`: `SPECIAL` (Primers/Michelman). `Row 25-87`: `SERIE 2`. `Row 88-151`: `SERIE 3`. |
| Column `D` (`Cdad. x caja`) | `Product.qty_per_box` | If integer $\ge 1$ $\rightarrow$ integer value. If `"NO SUPPLIES"`, empty or `None` $\rightarrow$ default `1`. |
| Column `E` (`Exworks`) | `Product.exworks_price` | Parse float to `Decimal(2)`. If missing or 0 $\rightarrow$ `Decimal("0.00")`. |
| Column `V` (`OBSERVACIONES`) | `Product.notes` | Strip whitespace. Store verbatim (e.g., "Tener 25"). |
| Global header / Default | `Product.shipping_route` | Default to `'Marítimo'` unless specified. |

### 4.2 File: `Forecast Serie 4 28-2-26 -v2_202603.xlsx` (Sheet: `Analisis S4`)

| Source Column / Row | Target Field | Transformation Rule |
|:---|:---|:---|
| Column `B` (`CODIGO`) | `Product.code` | Trim spaces, uppercase. Valid rows: 10 to 64. Ignore rows $\ge 70$ (cross-reference notes). |
| Column `C` (`CONSUMIBLES`) | `Product.description` | Trim spaces. |
| Fixed Section | `Product.series` | `SERIE 4` |
| Column `D` (`Cdad. x caja`) | `Product.qty_per_box` | Convert to `int`. Default `1` if non-numeric. |
| Column `E` (`MPS`) | `Product.mps_per_box` | Convert to `int` if numeric, else `None`. |
| Column `F` (`TIPO`) | `Product.category_type` | Trim text (`IP`, `OMP`). |
| Column `G` (`PRENSA`) | `Product.press_model` | Trim text (`10K`, `20K`, `BOTH`). |
| Column `H` (`Exworks`) | `Product.exworks_price` | Parse float to `Decimal(2)`. |
| Global header / Default | `Product.shipping_route` | Default to `'Marítimo'`. |
