# Feature Specification: Product Domain Model Refinement & Excel Seeding (US-05a)

**Feature Branch**: `US05a-product-data-model`  
**Created**: 2026-11-19  
**Status**: Pending Approval  
**Input**: Analysis of stakeholder Excel workbooks (`Forecast Serie 2-3` and `Forecast Serie 4`) to extract real-world product characteristics, extend the domain model, and prepare the catalog database seeding.

---

## 1. Executive Summary & Value Proposition

Currently, `US-05` provides a basic `Product` entity and registration endpoint. However, the stakeholder's actual operational spreadsheets (`docs/originals/Forecast Serie 2-3 al 28-2-26B_202603.xlsx` and `docs/originals/Forecast Serie 4 28-2-26 -v2_202603.xlsx`) reveal critical domain attributes required for future inventory forecasting and purchase order calculations:
- Machine series classifications (`SERIE 2`, `SERIE 3`, `SERIE 4`, `SPECIAL`).
- Specialized packaging factors (`qty_per_box`, `mps_per_box`, with edge cases like non-supplies items).
- Machine compatibility (`press_model`: 10K, 20K, BOTH).
- Material categorizations (`category_type`: IP, OMP).
- Operational safety buffer guidelines stored in stakeholder notes (`Tener 25`, `Tener 15 - 10 CCS`).

This feature formalizes the Product entity's Single Source of Truth (SSOT), executes a database schema migration, and implements an idempotent data seeding mechanism to ingest the ~140 real products into PostgreSQL.

---

## 2. User Scenarios & Testing *(Prioritized)*

### User Story 1 - Refined Product Domain Entity & Schema Evolution (Priority: P1)

As a Systems Architect, I want the `Product` entity in PostgreSQL to support all operational attributes from the stakeholder sheets, while maintaining complete backward compatibility with existing `US-05` API routes.

**Why this priority**: Without this database schema evolution, importing the stakeholder catalog will either discard critical attributes (MPS, press model, notes) or fail due to constraint mismatches.

**Independent Test**: The database migration can be executed against a pristine PostgreSQL database and an existing database without data loss, and all existing 42 unit/integration tests pass without regression.

**Acceptance Scenarios**:

1. **Given** an existing database with the initial `products` table from US-05, **When** the new Alembic migration is executed, **Then** columns `mps_per_box`, `category_type`, `press_model`, `notes`, and `updated_at` are added as nullable/defaulted fields without dropping existing records.
2. **Given** a new product payload submitted via `POST /api/v1/products`, **When** optional fields (`mps_per_box`, `category_type`, `press_model`, `notes`) are omitted, **Then** the record is persisted with appropriate null/default values and returns `201 Created`.
3. **Given** a product with `qty_per_box = 0` or negative `exworks_price`, **When** insertion is attempted, **Then** database check constraints actively reject the insert.

---

### User Story 2 - Stakeholder Excel Extraction & Normalization Service (Priority: P2)

As an Inventory Analyst, I want an automated extractor that reads both stakeholder Excel workbooks (`Forecast Serie 2-3` and `Forecast Serie 4`) and cleans, normalizes, and transforms the raw rows into validated domain entities.

**Why this priority**: Manual transcription of ~140 products with complex part numbers is error-prone and slow. Automated extraction ensures exact parity with the stakeholder's active inventory files.

**Independent Test**: Running the extractor against `docs/originals/` parses exactly the valid product rows, ignores subheaders (`CODIGO`, `VERIFICADO`, `TOTAL`), trims codes, normalizes `"NO SUPPLIES"` to `1`, and outputs typed `Product` objects.

**Acceptance Scenarios**:

1. **Given** the file `Forecast Serie 2-3 al 28-2-26B_202603.xlsx`, **When** the parser executes on sheet `Analisis S2 S3`, **Then** it extracts 93 products assigned to their respective series (`SPECIAL`, `SERIE 2`, `SERIE 3`), capturing part codes, descriptions, prices, and observations.
2. **Given** a row with `Cdad. x caja = 'NO SUPPLIES'` or empty, **When** processed by the normalization service, **Then** `qty_per_box` is safely converted to integer `1`.
3. **Given** the file `Forecast Serie 4 28-2-26 -v2_202603.xlsx`, **When** the parser executes on sheet `Analisis S4`, **Then** it extracts 47 products (rows 10-64), capturing `mps_per_box`, `category_type` (`IP`/`OMP`), and `press_model` (`10K`/`20K`/`BOTH`), while ignoring non-product reference rows ($\ge 70$).

---

### User Story 3 - Idempotent Catalog Seeding Command (Priority: P3)

As a DevOps Engineer or Administrator, I want a repeatable CLI seeding command to populate or sync the PostgreSQL product catalog from the Excel files.

**Why this priority**: Enables developers, CI test pipelines, and staging environments to bootstrap the complete production-representative catalog with one command.

**Independent Test**: Run the seed command once on an empty database (creates ~140 records); run it a second time immediately (updates or confirms without errors or duplicate code collisions).

**Acceptance Scenarios**:

1. **Given** a running PostgreSQL database, **When** `python -m src.catalog.scripts.seed_catalog` (or docker equivalent) is run, **Then** all ~140 products are committed, and an execution summary is logged showing inserted and updated counts.
2. **Given** that product `Q4210D` already exists, **When** the seed command is re-run, **Then** it updates attributes if changed, without creating a duplicate record or throwing a unique constraint violation.

---

## 3. Edge Cases & Handling Strategies

- **Trailing Whitespaces in Codes**: Several Excel cells have strings like `'MICH-DP680 '` or `'Q4284D '`. **Resolution**: The extractor must call `.strip().upper()` on all product codes.
- **Non-Numeric Quantities**: Values like `'NO SUPPLIES'` or blank cells. **Resolution**: Normalizer defaults to `1` box unit so calculations do not encounter division-by-zero or null math errors.
- **Missing or Zero Exworks Prices**: Some chemical primers or tools show zero or blank prices. **Resolution**: Store as `Decimal("0.00")` and flag in logs for analyst review.
- **Section Headers & Subtotals**: Spreadsheets contain embedded visual rows like `'SERIE 2'`, `'CODIGO'`, `'VERIFICADO'`, and totals. **Resolution**: Explicit row filtering based on part code heuristics and known row ranges.

---

## 4. Requirements *(Mandatory)*

### Functional Requirements

- **FR-001**: System MUST update the `products` table schema to include `mps_per_box`, `category_type`, `press_model`, `notes`, and `updated_at`.
- **FR-002**: System MUST generate a forward/backward Alembic migration script for the schema update.
- **FR-003**: System MUST enforce that `shipping_route` belongs to the set `{'Marítimo', 'Aéreo'}`.
- **FR-004**: System MUST extract products from `docs/originals/Forecast Serie 2-3 al 28-2-26B_202603.xlsx` (`Analisis S2 S3`) and assign series `SPECIAL`, `SERIE 2`, and `SERIE 3`.
- **FR-005**: System MUST extract products from `docs/originals/Forecast Serie 4 28-2-26 -v2_202603.xlsx` (`Analisis S4`) and assign series `SERIE 4`.
- **FR-006**: System MUST ensure that code lookups are case-insensitive and whitespace-trimmed.
- **FR-007**: Seeding mechanism MUST execute idempotently using upsert semantics (Insert on Conflict Update).
- **FR-008**: System MUST record audit log entries or console metrics detailing total products seeded.

---

## 5. Success Criteria *(Measurable Outcomes)*

- **SC-001**: 100% of the ~140 valid products across both stakeholder Excel workbooks are successfully parsed and persisted in PostgreSQL.
- **SC-002**: 0 regressions in existing automated test suites (all 42 backend tests continue passing).
- **SC-003**: The seeding command executes in under 5 seconds for the complete catalog.
- **SC-004**: Zero manual modifications required on source `.xlsx` files; the system handles raw stakeholder files directly.
