# Constitution — forecast_rta

## Project Identity
The **forecast_rta** system is an automated Inventory Forecast solution designed to replace manual, Excel-based processes. [cite_start]Its core purpose is to process historical sales and inventory data, apply dynamic mathematical models (12m/6m averages), and generate precise purchase order suggestions[cite: 1, 15, 31, 158].

The project is developed using **Elite SDD (Specification-Driven Development)**, TDD, and a **Modular Monolith** approach with **Hexagonal Architecture** per module.

## Tech Stack — NON-NEGOTIABLE
* **Environment:** Native Docker orchestration via Docker Compose.
* **Backend:** Python 3.13, FastAPI (Bleeding Edge stable version), Uvicorn/Gunicorn.
* **Persistence & Validation:** SQLModel (ORM) + Alembic (Migrations) + Pydantic V2(Data Contracts).
* **Database:** PostgreSQL.
* **Frontend:** React (Vite), Tailwind CSS, TypeScript.
* **Infrastructure:** Docker, Docker Compose.
* **CI/CD:** GitHub Actions to Render.
* **Testing:** Pytest (Backend), Jest/React Testing Library (Frontend).

## Source of Truth (SSOT)
* `.specify/memory/constitution.md` -> Global project laws.
* `/docs/prd.md`             -> Product Vision & Business Goals.
* `/docs/user-stories/`      -> Folder containing one file per User Story (Gherkin format).
* `.specify/modules/[Mod]/data_model.md` -> Module-level data schema SSOT.
* `.specify/modules/[Mod]/[US]/spec.md` -> Technical contract (Technology-agnostic).
* `.specify/modules/[Mod]/[US]/plan.md` -> Implementation strategy (Tech-specific).
* `.specify/modules/[Mod]/[US]/tasks.md` -> Atomic task list.

## Architecture Rules — NON-NEGOTIABLE
1. **Container-First Development:** The system MUST be developed and tested within Docker containers to ensure DevProd Parity.
2. **Hexagonal Isolation:** Every module must strictly separate Domain (logic), Application (use cases), and Infrastructure (API/DB adapters).
3. **Modern Dependency Policy:** Always use the latest stable version of core frameworks (e.g., FastAPI ^0.136.0) unless research.md proves an incompatibility.
4. **Independent Delivery:** Each User Story (US) must be a functional slice that can be developed, tested, and demonstrated independently (P1/P2/P3 prioritization).
5.  **Technology-Agnostic Specs:** Specifications (`spec.md`) MUST NOT mention frameworks, libraries, or database details. They focus exclusively on business value and behavior.
6.  **TDD Protocol:** No implementation code is written without a corresponding test that fails first.
7. **Pristine Test Environments:** Tests MUST run in isolated containers using ephemeral in-memory databases (SQLite) to prevent data contamination.
7.  **Reactive Domain:** The forecasting engine must be reactive; any change in historical data (e.g., a sale from 6 months ago) must trigger a re-evaluation of averages and availability[cite: 36, 237].
8.  **Pure Mathematics:** The forecast logic (averages, lead time calculations) must be pure Python, decoupled from FastAPI and SQLModel.

## Out of Scope — PROHIBITED
* Local development outside of Docker containers.
* Any database other than PostgreSQL.
* Leaking implementation details (like SQLModel or React) into the functional specifications.
* Direct database access between different functional modules.
* Fixed or outdated dependency versions in pyproject.toml without documented justification.
* Manual data manipulation that bypasses the defined domain rules.

## Rejection Criteria
Any proposal or code generation that violates these laws—especially regarding architectural isolation, TDD, or language policy (English for technical docs)—must be rejected and reformulated.
