# Tasks: Product Domain Model Refinement & Excel Seeding (US-05a)

**Input**: Design documents from `.specify/modules/02_catalog/US05_a_data_model/` (`spec.md`, `data_model.md`, `plan.md`)  
**Prerequisites**: Approved `spec.md`, `data_model.md`, and `plan.md`  
**Methodology**: Strict TDD (Test-Driven Development) & Zero-Regression Gate  
**Organization**: Tasks organized by User Story and execution phases.

---

## Phase 1: Setup & Baseline Regression Verification

**Purpose**: Confirm pristine test baseline before any code modifications.

- [ ] T072 Execute the existing test baseline (`pytest backend/tests` and `npm test` in `frontend/`) to verify that all 42 backend tests and 12 frontend tests are passing 100% in green prior to writing any new code.

---

## Phase 2: User Story 1 - Refined Product Domain Entity & Schema Evolution (Priority: P1) 🎯 MVP

**Goal**: Extend the `Product` entity with real operational attributes (`mps_per_box`, `category_type`, `press_model`, `notes`, `updated_at`, check constraints) and execute the Alembic schema migration, ensuring 100% backward compatibility with US-05.

### Tests for User Story 1 (Write first, ensure FAIL) ⚠️
- [ ] T073 [P] [US1] Write failing unit/integration tests in `backend/tests/catalog/test_product_domain_extended.py` verifying new field assignments, check constraints (`mps_per_box > 0`, `shipping_route in ('Marítimo', 'Aéreo')`), and that omitting optional fields maintains backward compatibility.

### Implementation for User Story 1
- [ ] T074 [US1] Update `ProductBase` and `Product` models in `backend/src/catalog/domain/models.py` with extended fields, check constraints, and default values per `data_model.md`.
- [ ] T075 [US1] Update `ProductResponse` output schema in `backend/src/catalog/infrastructure/api/schemas.py` to serialize extended attributes.
- [ ] T076 [US1] Generate and apply the forward/backward Alembic migration script in `backend/migrations/versions/` for the table evolution.
- [ ] T077 [US1] Run existing test `backend/tests/catalog/test_register_product.py` and new `test_product_domain_extended.py` to confirm tests pass with zero regressions on US-05.

**Checkpoint**: User Story 1 complete. Database and domain model now support all real product characteristics.

---

## Phase 3: User Story 2 - Stakeholder Excel Extraction & Normalization Engine (Priority: P2)

**Goal**: Build a decoupled extraction service using Python's standard library (`zipfile` + `xml.etree.ElementTree`) to parse, clean, and normalize ~140 products from both stakeholder workbooks without external dependencies.

### Tests for User Story 2 (Write first, ensure FAIL) ⚠️
- [ ] T078 [P] [US2] Create DTO contracts `ExtractedProductDTO` and `SeedingResultDTO` in `backend/src/catalog/application/dto.py`.
- [ ] T079 [P] [US2] Write failing unit tests in `backend/tests/catalog/test_excel_extractor_s23.py` for `Forecast Serie 2-3` extraction (testing section boundaries `SPECIAL`, `SERIE 2`, `SERIE 3`, code whitespace trimming, `"NO SUPPLIES"` $\rightarrow 1$ conversion, and notes extraction from column `V`).
- [ ] T080 [P] [US2] Write failing unit tests in `backend/tests/catalog/test_excel_extractor_s4.py` for `Forecast Serie 4` extraction (testing rows 10-64 bounds, skipping reference notes $\ge 70$, parsing MPS, category type `IP`/`OMP`, and press model `10K`/`20K`/`BOTH`).

### Implementation for User Story 2
- [ ] T081 [US2] Implement `ExcelExtractorS23` in `backend/src/catalog/infrastructure/excel/extractor_s23.py` to parse sheet `Analisis S2 S3` and return validated `List[ExtractedProductDTO]`.
- [ ] T082 [US2] Implement `ExcelExtractorS4` in `backend/src/catalog/infrastructure/excel/extractor_s4.py` to parse sheet `Analisis S4` and return validated `List[ExtractedProductDTO]`.

**Checkpoint**: User Story 2 complete. Both Excel files can be accurately extracted and normalized in memory.

---

## Phase 4: User Story 3 - Idempotent Catalog Seeding Service & CLI Command (Priority: P3)

**Goal**: Create an application service and CLI script that executes atomic, idempotent upserts of extracted products into the PostgreSQL database.

### Tests for User Story 3 (Write first, ensure FAIL) ⚠️
- [ ] T083 [P] [US3] Write failing integration tests in `backend/tests/catalog/test_catalog_seeder.py` asserting idempotent upsert (insert on clean database, update without error on re-run, duplicate code handling).

### Implementation for User Story 3
- [ ] T084 [US3] Implement upsert persistence logic in `backend/src/catalog/infrastructure/db/repository.py` (or session helper) using SQLModel/SQLAlchemy `ON CONFLICT (code) DO UPDATE`.
- [ ] T085 [US3] Implement `SeedCatalogUseCase` in `backend/src/catalog/application/seeder.py` coordinating the extractors, repository upserts, and execution metrics.
- [ ] T086 [US3] Implement the CLI entrypoint in `backend/src/catalog/infrastructure/cli/seed_catalog.py` capable of accepting custom file paths with defaults to `docs/originals/`.

**Checkpoint**: User Story 3 complete. Full end-to-end ingestion pipeline is functional and test-verified.

---

## Phase 5: Polish, End-to-End Live Seeding & Strict Regression Verification Gate

**Purpose**: Execute real live ingestion, audit logs, and enforce the zero-regression gate.

- [ ] T087 Execute live catalog seeding against the PostgreSQL database using `docs/originals/Forecast Serie 2-3 al 28-2-26B_202603.xlsx` and `docs/originals/Forecast Serie 4 28-2-26 -v2_202603.xlsx`, logging execution metrics.
- [ ] T088 [REGRESSION GATE] Run full backend test suite (`pytest backend/tests`) verifying that 100% of the 42 pre-existing tests + all new tests pass in green.
- [ ] T089 [REGRESSION GATE] Run frontend test suite (`npm test` in `frontend/`) verifying that 100% of the 12 pre-existing tests pass in green.
- [ ] T090 Update `.specify/memory/project_log.md` with final accomplishments, migration hash, and test coverage metrics.
