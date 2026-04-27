# Constitution — forecast_rta

## Project Identity
The **forecast_rta** system is an automated Inventory Forecast solution designed to replace manual, Excel-based processes. [cite_start]Its core purpose is to process historical sales and inventory data, apply dynamic mathematical models (12m/6m averages), and generate precise purchase order suggestions[cite: 1, 15, 31, 158].

The project is developed using **Elite SDD (Specification-Driven Development)**, TDD, and a **Modular Monolith** approach with **Hexagonal Architecture** per module.

## Tech Stack — NON-NEGOTIABLE
* **Backend:** Python 3.13, FastAPI, Uvicorn/Gunicorn.
* **Persistence & Validation:** SQLModel (ORM) + Alembic (Migrations) + Pydantic (Data Contracts).
* **Database:** PostgreSQL.
* **Frontend:** React (Vite), Tailwind CSS, TypeScript.
* **Infrastructure:** Docker, Docker Compose.
* **CI/CD:** GitHub Actions to Render.
* **Testing:** Pytest (Backend), Jest/React Testing Library (Frontend).

## Source of Truth (SSOT)
* `/memory/constitution.md` -> Global project laws.
* `/docs/prd.md`             -> Product Vision & Business Goals.
* `/docs/user-stories/`      -> Folder containing one file per User Story (Gherkin format).
* `.specify/modules/[Mod]/[US]/spec.md` -> Technical contract (Technology-agnostic).
* `.specify/modules/[Mod]/[US]/plan.md` -> Implementation strategy (Tech-specific).
* `.specify/modules/[Mod]/[US]/tasks.md` -> Atomic task list.

## Architecture Rules — NON-NEGOTIABLE
1.  **Independent Delivery:** Each User Story (US) must be a functional slice that can be developed, tested, and demonstrated independently (P1/P2/P3 prioritization).
2.  **Hexagonal Isolation:** Every module must strictly separate **Domain** (logic), **Application** (use cases), and **Infrastructure** (API/DB adapters).
3.  **Technology-Agnostic Specs:** Specifications (`spec.md`) MUST NOT mention frameworks, libraries, or database details. They focus exclusively on business value and behavior.
4.  **TDD Protocol:** No implementation code is written without a corresponding test that fails first.
5.  **Reactive Domain:** The forecasting engine must be reactive; any change in historical data (e.g., a sale from 6 months ago) must trigger a re-evaluation of averages and availability[cite: 36, 237].
6.  **Pure Mathematics:** The forecast logic (averages, lead time calculations) must be pure Python, decoupled from FastAPI and SQLModel.

## Out of Scope — PROHIBITED
* Any database other than PostgreSQL.
* Leaking implementation details (like SQLModel or React) into the functional specifications.
* Direct database access between different functional modules.
* Manual data manipulation that bypasses the defined domain rules.

## Rejection Criteria
Any proposal or code generation that violates these laws—especially regarding architectural isolation, TDD, or language policy (English for technical docs)—must be rejected and reformulated.
