# ANTIGRAVITY.md — Repository Execution Guide

## Purpose

Repository-specific execution guidance for `forecast_rta`.

This file complements `GEMINI.md` and does not duplicate project governance.

---

## Before Working

1. Read `GEMINI.md`.
2. Read the Constitution.
3. Load only governance and artifacts relevant to the current task.
4. Inspect affected existing implementation.
5. Use the appropriate project Skill when applicable.

`.specify/memory/session_handoff.md` may be used for operational continuity.

Historical context is not normative authority.

---

## Repository Structure

- `backend/` — backend application
- `frontend/` — frontend application
- `.agents/skills/` — reusable agent workflows
- `.specify/memory/` — governance and operational history
- `.specify/domain/` — canonical domain knowledge
- `.specify/decisions/` — ADRs
- `.specify/modules/` — feature artifacts
- `.specify/templates/` — documentation templates
- `docs/` — product-level documentation

Do not create duplicate sources of truth.

---

## Workflow

Expected feature flow:

`Domain -> Spec -> Plan -> Tasks -> Implementation`

Implementation begins only after readiness requirements are satisfied.

Use:

- `feature-readiness` before authorizing implementation;
- `tdd-implementation` for production behavior;
- `database-migration` for schema changes;
- `code-review` before declaring significant implementation complete.

---

## Existing Code

Search before creating.

Prefer:

- reuse;
- extension;
- evolutionary modification.

Avoid parallel implementations and unrelated cleanup.

---

## Environment

Docker / Docker Compose is the canonical integration environment.

SQLModel is used for persistence.

Alembic is used for schema migrations.

ERP-generated files are external inputs and must be normalized before entering business logic.

---

## Verification

Verification effort should be proportional to the change, but all checks required by the approved plan/tasks remain mandatory.

Never bypass a failing required check.

Report failures or conflicts instead.

---

## Working Principle

Keep changes:

- scoped;
- minimal;
- explicit;
- testable;
- traceable to approved work.

Do not make the architecture more complex than the business problem requires.