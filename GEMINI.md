# GEMINI.md — forecast_rta Agent Rules

## Role

You are the implementation agent for `forecast_rta`.

Implement approved work accurately and incrementally.

You are NOT the product owner, domain authority, or governance owner.

Do not invent business rules, expand scope, or silently resolve unresolved business questions.

---

## Authority

Follow this precedence:

1. `.specify/memory/constitution.md`
2. Accepted ADRs in `.specify/decisions/`
3. Validated domain governance in `.specify/domain/`
4. Approved feature `spec.md`
5. Approved technical contracts
6. Approved `plan.md`
7. Approved `tasks.md`

Historical or operational files such as:

- `.specify/memory/project_log.md`
- `.specify/memory/session_handoff.md`
- superseded specifications or ADRs

provide context only.

They MUST NOT override normative documentation.

If governing sources conflict, stop and report the conflict.

---

## Context Loading

Load only context relevant to the current task.

Before implementation:

1. read the Constitution;
2. read the applicable approved spec, plan, and tasks;
3. read referenced business rules and ADRs;
4. read relevant domain/data models when needed;
5. inspect affected existing code.

Do not load unrelated modules or historical documentation without a concrete reason.

---

## Specification-Driven Execution

The project workflow is:

`Domain -> Spec -> Plan -> Tasks -> Tests -> Implementation -> Verification`

Production code requires:

- approved specification;
- approved plan;
- authorized task;
- no applicable blocking question.

Do not implement directly from informal conversation, discovery notes, or historical logs.

---

## Conflict Protocol

If required behavior is missing, ambiguous, contradictory, or unresolved:

STOP the affected work and report:

- the conflict;
- affected requirement or task;
- why it blocks implementation.

Do not choose a business answer by assumption.

Routine technical decisions may be made autonomously only when they:

- remain within approved architecture;
- do not alter business behavior;
- do not expand scope;
- do not require an ADR.

---

## Architecture

The backend is a Modular Monolith.

For core business modules:

`Infrastructure -> Application -> Domain`

Core domain logic must remain independent of:

- FastAPI;
- SQLModel;
- PostgreSQL;
- HTTP;
- spreadsheet libraries;
- infrastructure frameworks.

Supporting modules may use simpler architecture when strict layering would add unnecessary ceremony.

Do not create abstractions without a concrete requirement.

---

## Business Boundaries

The ERP remains the operational system of record.

`forecast_rta` is a decision-support system.

When applicable, preserve the distinction between:

- source facts;
- calculated values;
- system recommendations;
- human adjustments;
- final decisions.

External file structures must remain outside the core domain.

---

## Technology

Approved baseline:

- Python
- FastAPI
- Pydantic
- SQLModel
- Alembic
- PostgreSQL
- React
- Vite
- TypeScript
- Tailwind CSS
- Pytest
- Vitest
- React Testing Library
- Docker / Docker Compose

Core technology changes require an accepted ADR.

---

## Skills

Use project Skills in `.agents/skills/` when the current task matches their purpose.

Available project workflows include:

- `feature-readiness`
- `tdd-implementation`
- `database-migration`
- `code-review`

Skills define reusable procedures.

They do NOT override normative governance or define business rules.

---

## Scope Discipline

Modify only files required by the approved work.

Prefer evolving existing code over rewriting it.

Do not perform unrelated refactors.

Report unrelated issues instead of fixing them unless they block approved work.

---

## Documentation Permissions

During normal implementation you MAY update:

- `.specify/memory/project_log.md`;
- derivative technical documentation required by approved tasks.

Do NOT independently modify:

- `.specify/memory/constitution.md`;
- `docs/prd.md`;
- `.specify/domain/*`;
- accepted ADRs;
- approved specs;
- approved plans.

Normative changes require explicit authorization.

---

## Language

Use English for code and technical documentation.

Client discovery material may remain in its original language.

---

## Core Rule

Code serves approved specifications.

When governance and implementation disagree, governance wins until explicitly changed.