# Module 02: Product Catalog — Data Model

**Module Owner**: Catalog Team  
**Status**: Active SSOT  
**Last Updated**: 2026-08-06

---

## 1. Domain Entities & Schemas

### 1.1 `Product` (SQLModel Entity)

Represents an individual item within the inventory catalog, serving as the foundational reference for sales history, forecasting calculations, and purchase order suggestions.

| Field Name | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default: `uuid4()` | Unique immutable identifier of the product. |
| `code` | `str` | Unique, Indexed, Non-null | Unique stock-keeping unit (SKU) identifier. |
| `description` | `str` | Non-null | Detailed commercial product title/description. |
| `qty_per_box` | `int` | Non-null, Check: `qty_per_box > 0` | Master carton packaging quantity. |
| `exworks_price` | `Decimal` | Non-null, `max_digits=10`, `decimal_places=2`, Check: `>= 0` | Unit price at origin factory in USD. |
| `series` | `str` | Non-null | Product collection or series classification. |
| `shipping_route` | `str` | Non-null | Transport mode / route designation (e.g., Maritime, Air). |
| `is_active` | `bool` | Non-null, Default: `True` | Soft-deletion flag (`True` = Active, `False` = Soft-deleted). |
| `created_at` | `datetime` | Non-null, Default: `UTC Now` | Timestamp of initial record creation. |

---

## 2. API Data Transfer Objects (DTOs)

### 2.1 US-05: Product Creation DTOs
- **`ProductCreate`**: Input payload with strict string trimming, positive integers, and decimal price validations.
- **`ProductResponse`**: Output representation including `id`, formatted string `exworks_price`, and `created_at`.

### 2.2 US-06: Product Modification DTOs
- **`ProductUpdate`**: Partial update payload with all fields optional (`code`, `description`, `qty_per_box`, `exworks_price`, `series`, `shipping_route`, `is_active`).

### 2.3 US-07: Product Catalog Query DTOs
- **`ProductFilterParams`**: Query parameters for catalog retrieval (`search`, `series`, `shipping_route`, `is_active`, `page`, `page_size`, `sort_by`, `sort_order`).
- **`PaginatedProductResponse`**: List wrapper containing `items: List[ProductResponse]`, `total: int`, `page: int`, `page_size: int`, and `total_pages: int`.

---

## 3. Database Integrity & Constraints

- **Unique Code Index**: `products_code_key` ensures no duplicate active or inactive SKUs.
- **Positive Box Quantity**: `check_qty_per_box_positive` constraint (`qty_per_box > 0`).
- **Non-negative Price**: `check_exworks_price_non_negative` constraint (`exworks_price >= 0`).
- **Audit Log Synergy**: Updates and state changes append structured event payloads (`PRODUCT_UPDATED`, `PRODUCT_DEACTIVATED`, `PRODUCT_REACTIVATED`) to `audit_logs`.
