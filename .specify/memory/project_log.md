# Project Context Checkpoint: forecast_rta

## 1. Project Identity & Purpose
- **Name:** forecast_rta
- [cite_start]**Core Mission:** Automated Inventory Forecast system for RTA to replace complex Excel-based manual processes[cite: 1, 8, 15].
- [cite_start]**Key Logic:** Dynamic forecast based on 12-month and 6-month sales averages, lead times (Maritime/Air), and target availability months [cite: 31-36, 80-87].

## 2. Technical Stack (Non-Negotiable)
- **Backend:** Python 3.13, FastAPI, Uvicorn/Gunicorn.
- **Data/Persistence:** SQLModel (ORM), Alembic (Migrations), PostgreSQL.
- **Frontend:** React (Vite), Tailwind CSS, TypeScript.
- **Infrastructure:** Docker & Docker Compose.
- **Deployment:** GitHub Actions (CI/CD) to Render.
- **Quality:** TDD (Pytest for Backend, Jest/RTL for Frontend).

## 3. Architecture & Methodology
- **Pattern:** Modular Monolith with strict **Hexagonal Architecture** (Ports & Adapters) per module.
- **Methodology:** **Elite SDD (Specification-Driven Development)** inspired by spec-kit/claudecode.
- **Language Policy:** Technical documentation (`specs`, `stories`, `plans`, `code`) MUST be in **English** to ensure tool compatibility and prevent translation debt.
- **Delivery Principle:** Independent User Story (US) delivery with P1/P2/P3 prioritization.

## 4. Documentation Structure (SSOT)
- `/memory/constitution.md` -> Global laws and tech stack.
- `/docs/prd.md`             -> Product Requirements Document.
- `/docs/user-stories/`      -> Folder with individual US in Gherkin format.
- `/specs/[ID-feature]/`     -> Atomic folders containing spec, data-model, contracts, plan, and tasks.
- `ANTIGRAVITY.md`           -> Project-specific rules for the AI-assisted IDE.

## 5. Major Decisions & Progress
- [x] [cite_start]PRD and Excel analysis completed [cite: 1-157].
- [x] [cite_start]Initial User Stories (31 stories) identified across 8 modules [cite: 158-291].
- [x] Methodology upgraded to "Elite SDD" (Independent stories, mandatory checklists, foundational phases).
- [x] Decision made to migrate all technical docs to English.
- [x] Decision to use SQLModel instead of SQLAlchemy.
- [x] **US-01 User Registration:** Full set of 8 governance files completed (Spec, Data-Model, Plan, Tasks, etc.).
- [x] **IDE Config:** `ANTIGRAVITY.md` created for context persistence.

## [2026-04-29] - User Registration Governance Phase

**Status**: Phase 0/1 (Design & Planning) COMPLETE for US-01.

### Accomplishments:
- **Requirement Finalization**: Defined the full specification for User Registration (`spec.md`), including the three mandatory roles: Admin, Analyst, and Reviewer.
- **Technical Planning**: Established the implementation strategy using a Modular Monolith with Hexagonal Architecture and Docker orchestration (`plan.md`).
- **Security Design**: Documented the decision to use Bcrypt for hashing and OAuth2 with JWT Scopes for RBAC (`research.md`).
- **API Contract**: Finalized the REST interface contract (`api-contract.md`) for the `/auth/register` and `/auth/token` endpoints.
- **Execution Roadmap**: Created a detailed TDD-based task list (`tasks.md`) to guide the implementation phase.
- **Operational Readiness**: Delivered a Docker-centric guide (`quickstart.md`) for bootstrapping and validating the module.
- **Quality Assurance**: Initialized the specification checklist (`checklist.md`) and the foundational data model entities (`data-model.md` - Part 1).

### Decisions:
- Adopted **SQLModel** as the bridge between Pydantic and SQLAlchemy to minimize boilerplate while maintaining type safety.
- Enforced **Synchronous Audit Logging** for all registration events to comply with transparency requirements.
- Selected **Docker Compose exec** as the primary method for running migrations and tests to ensure environment parity.

### Next Steps:
- Complete the remaining sections of `data-model.md` (Pydantic validation & Audit entities).
- Execute T001-T003 from `tasks.md` to initialize the repository structure.
