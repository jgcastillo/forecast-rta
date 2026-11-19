# Implementation Plan: Product Domain Model Refinement & Excel Seeding (US-05a)

**Branch**: `US05a-product-data-model` | **Date**: 2026-11-19  
**Spec**: [spec.md](file:///mnt/wwn-0x5000c5002f58992d-part1/My_Data/Projects/Zoraida/forecast_rta/.specify/modules/02_catalog/US05_a_data_model/spec.md)  
**Data Model SSOT**: [data_model.md](file:///mnt/wwn-0x5000c5002f58992d-part1/My_Data/Projects/Zoraida/forecast_rta/.specify/modules/02_catalog/US05_a_data_model/data_model.md)  
**Input**: Stakeholder operational workbooks in `docs/originals/` (`Forecast Serie 2-3` and `Forecast Serie 4`).

---

## 1. Summary

Evolve the `Product` domain entity and PostgreSQL schema to capture all real-world operational attributes discovered in stakeholder workbooks (`mps_per_box`, `category_type`, `press_model`, `notes`, `updated_at`, and packaging normalization rules). Build a decoupled extraction and normalization pipeline following Hexagonal Architecture (Domain $\rightarrow$ Application $\rightarrow$ Infrastructure) and expose an idempotent seeding CLI command to populate the database with the ~140 real products, ensuring 100% backward compatibility with existing US-05 routes and tests.

---

## 2. Technical Context

- **Language/Version**: Python 3.13 (FastAPI modular monolith).
- **ORM & Validation**: SQLModel, SQLAlchemy Check Constraints, Pydantic v2.
- **Database Migrations**: Alembic.
- **Storage**: PostgreSQL 16 (Containerized).
- **Spreadsheet Processing**: Decoupled reader using Python's standard library (`zipfile` + `xml.etree.ElementTree`) to ensure zero unvetted runtime dependencies and seamless execution across local, Docker, and CI/CD environments.
- **Testing**: `pytest` with in-memory SQLite fixtures and integration test transactions.
- **Architectural Pattern**: Hexagonal Architecture (Ports & Adapters) + Domain-Driven Design (DDD).

---

## 3. Constitution & Architectural Governance Check

*GATE: Must strictly adhere to `.specify/memory/constitution.md`.*

| Constitution Rule | Status | Implementation Strategy in this Feature |
|:---|:---:|:---|
| **Hexagonal Layering** | **PASS** | Domain (`models.py`) remains pure. Application contains the Seeding Use Case (`catalog_seeder.py`). Infrastructure contains the Excel Adapter (`excel_extractor.py`), Alembic migrations, and CLI command. |
| **Data Integrity at Edges** | **PASS** | Pydantic validation on all input data before reaching domain entities; database-level check constraints (`qty_per_box > 0`, `exworks_price >= 0`, `shipping_route in ('Marítimo', 'Aéreo')`). |
| **Test-Driven Development (TDD)**| **PASS** | All new parsers and services will have unit and integration tests written first before writing production parsing logic. |
| **Zero Regressions (Strict Gate)**| **PASS** | All 42 existing backend tests and 12 frontend tests must continue passing without regression. Existing tests must NOT be modified to force a pass. |
| **Change Approval Protocol**| **PASS** | If ANY adjustment to existing tests or legacy code is deemed necessary, it MUST be reported to the user with a technical justification and WAITING for explicit approval before any action is taken. |
| **Backward Compatibility** | **PASS** | Existing `ProductCreate` and `POST /api/v1/products` remain functional without changes; all new fields are nullable or have sensible defaults. |
| **Language Policy** | **PASS** | Code, docstrings, schema names, and documentation are strictly authored in English. |

---

## 4. Project Structure & File Layout

### 4.1 Documentation Layout (This Feature)
```text
.specify/modules/02_catalog/US05_a_data_model/
├── data_model.md        # Single Source of Truth for Product schema
├── spec.md              # Requirements and prioritized user journeys
├── plan.md              # This architecture and execution plan
└── tasks.md             # TDD task breakdown (Generated upon approval of plan.md)
```

### 4.2 Source Code Layout
```text
backend/
├── migrations/versions/
│   └── [hash]_extend_products_table_us05a.py     # Alembic schema evolution
├── src/
│   └── catalog/
│       ├── domain/
│       │   └── models.py                         # Updated Product & ProductBase models
│       ├── application/
│       │   ├── dto.py                            # ExtractedProductDTO, SeedingResultDTO
│       │   └── seeder.py                         # SeedCatalogUseCase (idempotent upsert)
│       └── infrastructure/
│           ├── excel/
│           │   ├── extractor_s23.py              # Reader for Forecast Serie 2-3 (.xlsx)
│           │   └── extractor_s4.py               # Reader for Forecast Serie 4 (.xlsx)
│           ├── db/
│           │   └── product_repository.py         # Upsert operations
│           └── cli/
│               └── seed_catalog.py               # CLI entrypoint: python -m src.catalog.infrastructure.cli.seed_catalog
└── tests/
    └── catalog/
        ├── test_excel_extractor.py               # Unit tests for workbook parsing & sanitization
        ├── test_catalog_seeder.py                # Unit & integration tests for idempotent upsert
        └── test_register_product.py              # Existing regression verification (must stay green)
```

---

## 5. Implementation Phases & Structural Strategy

### Phase 1: Domain Evolution & Database Migration (P1)
1. **Model Evolution**: Update `backend/src/catalog/domain/models.py`:
   - Add `mps_per_box: Optional[int] = Field(default=None)`
   - Add `category_type: Optional[str] = Field(default=None, max_length=50)`
   - Add `press_model: Optional[str] = Field(default=None, max_length=50)`
   - Add `notes: Optional[str] = Field(default=None)`
   - Add `updated_at: Optional[datetime] = Field(default=None)`
   - Add table check constraints for `mps_per_box` and `shipping_route`.
   - Update `ProductResponse` schema in `schemas.py` to serialize new fields.
2. **Alembic Migration**: Generate and verify migration adding nullable columns and check constraints.

### Phase 2: Excel Extraction & Normalization Engine (P2)
1. **Extraction Ports & DTOs**: Define `ExtractedProductDTO` in application layer to decouple Excel structure from database entities.
2. **Serie 2 & 3 Extractor (`extractor_s23.py`)**:
   - Parses sheet `Analisis S2 S3`.
   - Identifies boundaries: `SPECIAL` (Primers/Michelman, rows 16-24), `SERIE 2` (rows 25-87), `SERIE 3` (rows 88-151).
   - Sanitizes part numbers (`strip()`, `upper()`).
   - Normalizes `Cdad. x caja`: `'NO SUPPLIES'` or empty $\rightarrow 1$.
   - Captures notes from column `V` (`OBSERVACIONES`).
3. **Serie 4 Extractor (`extractor_s4.py`)**:
   - Parses sheet `Analisis S4`.
   - Reads rows 10 through 64 (skipping reference notes at row 70+).
   - Extracts `mps_per_box` (column `E`), `category_type` (column `F`), and `press_model` (column `G`).
   - Assigns series `SERIE 4`.

### Phase 3: Idempotent Seeding Application Service (P3)
1. **Upsert Logic (`SeedCatalogUseCase`)**:
   - Receives list of normalized `ExtractedProductDTO`.
   - Performs atomic transaction:
     - If product code does not exist: create `Product` and emit `PRODUCT_CREATED` audit log.
     - If product code already exists: update attributes (`description`, `exworks_price`, `mps_per_box`, `notes`, etc.), update `updated_at`, and emit `PRODUCT_UPDATED` audit log if changes detected.
2. **Unit & Integration Testing**:
   - Verify parsing with representative sample fixtures.
   - Verify that running the seeder twice results in zero duplicate errors and correct count updates.

### Phase 4: CLI Tooling & Live Catalog Verification
1. **CLI Script (`seed_catalog.py`)**:
   - Accepts workbook paths (defaulting to `docs/originals/Forecast Serie 2-3 al 28-2-26B_202603.xlsx` and `docs/originals/Forecast Serie 4 28-2-26 -v2_202603.xlsx`).
   - Logs execution metrics (e.g. `Seeded 140 products: 140 inserted, 0 updated, 0 errors`).
2. **Strict Regression Verification Protocol**:
   - Execute full test suite `pytest backend/tests` ensuring 100% pass rate of the 42 pre-existing tests.
   - Execute frontend tests `npm test` ensuring 100% pass rate of the 12 pre-existing tests.
   - **MANDATORY HOLD RULE**: Under NO circumstances will existing test assertions or legacy logic be altered without prior written notification to the user, a clear explanation of why an adjustment is necessary, and waiting for explicit user approval before touching any existing test file.

---

## 6. Risk Assessment & Mitigations

| Risk | Impact | Mitigation Strategy |
|:---|:---:|:---|
| **Code collision across S2-S3 and S4** | Medium | Extractor runs a deduplication check; S4 records take precedence for S4 presses, but duplicate codes log a warning if attributes mismatch. |
| **Unformatted/Dirty cells in Excel** | Medium | Strict sanitization pipeline: `.strip()`, decimal float conversion with fallback to `0.00`, integer fallback to `1` for packaging. |
| **Breaking existing US-05 frontend form** | Low | All newly introduced fields on `ProductBase` are optional/defaulted. The frontend registration form continues to submit valid payloads without modification. |
