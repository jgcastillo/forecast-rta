# ANTIGRAVITY.md — Project Execution Guide

## 1. Purpose

This file defines repository-specific execution guidance for `forecast_rta`.

It complements `GEMINI.md`.

If any instruction here conflicts with:

1. `.specify/memory/constitution.md`
2. accepted ADRs
3. validated domain governance
4. approved feature specifications

the higher-precedence document wins.

---

## 2. Before Working

Before planning or coding:

1. read `GEMINI.md`;
2. read `.specify/memory/constitution.md`;
3. read the approved `spec.md`, `plan.md`, and `tasks.md` for the current feature;
4. read only the referenced business rules, ADRs, and domain documents;
5. inspect the existing implementation affected by the task.

Use `.specify/memory/session_handoff.md` only for operational continuity.

Do not treat historical documents as current requirements.

---

## 3. Repository Structure

Primary project areas:

- `backend/` — backend application
- `frontend/` — frontend application
- `.specify/memory/` — project governance and historical context
- `.specify/domain/` — canonical domain knowledge
- `.specify/decisions/` — Architecture Decision Records
- `.specify/modules/` — feature specifications, plans, tasks, and related artifacts
- `.specify/templates/` — documentation templates
- `docs/` — product-level and explanatory documentation

Do not create duplicate sources of truth in alternative folders.

---

## 4. Development Flow

The expected feature workflow is:

`Domain -> Spec -> Plan -> Tasks -> Implementation`

Implementation begins only when the applicable specification, plan, and tasks are approved and no blocking question remains.

Do not implement directly from informal conversation, discovery notes, or historical project logs.

---

## 5. Backend Boundaries

The backend is a Modular Monolith.

For core business logic:

`Infrastructure -> Application -> Domain`

Core domain code must remain independent of frameworks and persistence.

Infrastructure-specific concerns include:

- FastAPI;
- SQLModel;
- PostgreSQL;
- Alembic;
- spreadsheet parsing;
- external integrations.

Do not place framework-specific models in the core domain unless an approved plan explicitly classifies the module as a simplified supporting module.

---

## 6. TDD

Production behavior follows Red-Green-Refactor.

For every relevant behavior:

1. add or modify the test;
2. confirm expected failure;
3. implement minimum behavior;
4. confirm the test passes;
5. run affected regression tests.

Tests are part of the implementation, not follow-up work.

---

## 7. Existing Code

Prefer evolutionary modification over rewriting.

Before creating a new abstraction:

- search for an existing component that already serves the responsibility;
- reuse or extend it when appropriate;
- avoid parallel implementations of the same concept.

Do not perform unrelated cleanup during an approved feature task.

---

## 8. Database Changes

Use SQLModel for persistence and Alembic for migrations.

For schema changes:

1. confirm the approved data model or plan requires the change;
2. create the migration;
3. inspect the generated migration;
4. apply it in the Docker development environment;
5. run relevant integration tests.

Do not add speculative fields or tables.

---

## 9. External Files

ERP-generated files are external inputs.

Parsing and normalization belong in adapters.

The domain must not depend on:

- workbook formatting;
- spreadsheet coordinates;
- source column names;
- file-specific formulas.

Normalize source data before business calculations.

---

## 10. Verification

Docker / Docker Compose is the canonical integration environment.

Before declaring implementation complete, run the verification required by `plan.md` and `tasks.md`, including applicable:

- backend tests;
- frontend tests;
- integration tests;
- type checks;
- production builds;
- migration checks.

Report failures instead of bypassing them.

---

## 11. Documentation Updates

After completed implementation, update `.specify/memory/project_log.md` when required.

Do not modify normative governance unless explicitly authorized.

If implementation reveals a business or architectural conflict, report it instead of modifying governance to fit the code.

---

## 12. Working Principle

Keep the implementation:

- minimal;
- explicit;
- testable;
- aligned with approved documentation.

Do not make the architecture more complex than the business problem requires.