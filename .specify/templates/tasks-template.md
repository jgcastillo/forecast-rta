# Tasks: [FEATURE NAME]

**Feature ID:** [FEATURE_ID]
**Status:** DRAFT
**Created:** [DATE]
**Last Updated:** [DATE]

---

## 1. Purpose

This document defines the atomic execution tasks required to implement the approved feature.

Tasks MUST derive from the approved specification and plan.

They MUST NOT introduce:

- new business rules;
- new feature scope;
- unresolved assumptions;
- architectural decisions not present in the approved plan.

---

## 2. References

### Normative

- Constitution: `.specify/memory/constitution.md`
- Specification: `[PATH_TO_SPEC]`
- Business Rules:
  - [BR-XXX]
- ADRs:
  - [ADR-XXX OR N/A]

### Derivative

- Plan: `[PATH_TO_PLAN]`
- Data Model: [PATH OR N/A]
- Technical Contracts: [PATH OR N/A]

---

## 3. Task Format

Use:

`- [ ] TXXX [TYPE] [TRACE] Description in exact/path/to/file`

### Types

- `[TEST]`
- `[DOMAIN]`
- `[APP]`
- `[INFRA]`
- `[DB]`
- `[MIGRATION]`
- `[API]`
- `[UI]`
- `[CONTRACT]`
- `[REFACTOR]`
- `[VERIFY]`
- `[DOC]`

### Traceability

Use applicable identifiers:

- `[BR-XXX]`
- `[FR-XXX]`
- `[AC-XXX]`
- `[INV-XXX]`
- `[ADR-XXX]`

Example:

`- [ ] T012 [TEST] [BR-014][AC-003] Add failing availability calculation test in backend/tests/planning/domain/test_availability.py`

Tasks MUST be atomic and objectively verifiable.

---

## 4. TDD Rule

Production behavior MUST follow:

1. write the relevant failing test;
2. confirm it fails for the expected reason;
3. implement the minimum behavior;
4. confirm the test passes;
5. run affected regression tests;
6. refactor while tests remain green.

Tests are mandatory.

Production behavior MUST NOT be implemented before its corresponding test unless an explicitly approved exception exists.

---

## 5. Pre-Implementation

- [ ] T001 [VERIFY] Confirm `spec.md` status is `APPROVED`.
- [ ] T002 [VERIFY] Confirm `plan.md` status is `APPROVED`.
- [ ] T003 [VERIFY] Confirm no blocking open question applies.
- [ ] T004 [VERIFY] Confirm required business rules are validated.
- [ ] T005 [VERIFY] Confirm required ADRs are accepted.
- [ ] T006 [VERIFY] Confirm the expected Git branch and working-tree state.
- [ ] T007 [VERIFY] Run relevant existing tests and record the baseline result.

**Checkpoint:** Stop if any blocking governance conflict exists.

---

## 6. Domain

Include only when business logic exists.

### [BEHAVIOR / RULE]

- [ ] T0XX [TEST] [BR-XXX][AC-XXX] Add failing domain test in `[TEST_PATH]`.
- [ ] T0XX [VERIFY] Run the test and confirm expected failure.
- [ ] T0XX [DOMAIN] [BR-XXX] Implement minimum behavior in `[SOURCE_PATH]`.
- [ ] T0XX [VERIFY] Confirm the new test passes.

Repeat for each independent business behavior.

After domain implementation:

- [ ] T0XX [VERIFY] Run affected domain tests.
- [ ] T0XX [REFACTOR] Refactor if needed while keeping tests green.

**Checkpoint:** Core business behavior is independently testable without infrastructure.

---

## 7. Application

Include only when use-case orchestration is required.

### [USE CASE]

- [ ] T0XX [TEST] [FR-XXX][AC-XXX] Add failing application test in `[TEST_PATH]`.
- [ ] T0XX [VERIFY] Confirm expected failure.
- [ ] T0XX [APP] [FR-XXX] Implement use case in `[SOURCE_PATH]`.
- [ ] T0XX [APP] [FR-XXX] Add or modify required ports in `[PATH]`.
- [ ] T0XX [VERIFY] Confirm application tests pass.

Business rules MUST NOT be moved from the domain into application orchestration.

---

## 8. Persistence and Migration

Include only when required.

- [ ] T0XX [TEST] [FR-XXX] Add failing persistence/integration test in `[TEST_PATH]`.
- [ ] T0XX [VERIFY] Confirm expected failure.
- [ ] T0XX [DB] [FR-XXX] Create or modify persistence model in `[PATH]`.
- [ ] T0XX [INFRA] [FR-XXX] Implement repository/adapter changes in `[PATH]`.
- [ ] T0XX [VERIFY] Confirm persistence tests pass.

If schema changes are required:

- [ ] T0XX [MIGRATION] Create Alembic migration for [CHANGE].
- [ ] T0XX [VERIFY] Review migration for unintended changes.
- [ ] T0XX [VERIFY] Apply migration in the Docker development environment.
- [ ] T0XX [VERIFY] Confirm migration succeeds.

Do not create persistence structures for hypothetical future needs.

---

## 9. External Data / Imports

Include only when required.

- [ ] T0XX [TEST] [FR-XXX] Add failing adapter test for valid source input.
- [ ] T0XX [TEST] [FR-XXX] Add failing adapter test for invalid source input.
- [ ] T0XX [VERIFY] Confirm expected failures.
- [ ] T0XX [INFRA] [FR-XXX] Implement source parsing in `[PATH]`.
- [ ] T0XX [INFRA] [FR-XXX] Implement normalization in `[PATH]`.
- [ ] T0XX [INFRA] [FR-XXX] Implement validation/rejection handling.
- [ ] T0XX [VERIFY] Confirm adapter tests pass.
- [ ] T0XX [VERIFY] Confirm source-specific structures do not leak into the domain.

---

## 10. API

Include only when required.

- [ ] T0XX [TEST] [FR-XXX][AC-XXX] Add failing API/contract test in `[TEST_PATH]`.
- [ ] T0XX [VERIFY] Confirm expected failure.
- [ ] T0XX [CONTRACT] [FR-XXX] Create or modify request/response contract in `[PATH]`.
- [ ] T0XX [API] [FR-XXX] Implement or modify API adapter in `[PATH]`.
- [ ] T0XX [VERIFY] Confirm API tests pass.

API controllers MUST NOT implement business rules.

---

## 11. Frontend

Include only when required.

- [ ] T0XX [TEST] [AC-XXX] Add failing frontend test in `[TEST_PATH]`.
- [ ] T0XX [VERIFY] Confirm expected failure.
- [ ] T0XX [UI] [FR-XXX] Create or modify frontend hook/service in `[PATH]`.
- [ ] T0XX [UI] [FR-XXX] Create or modify presentation component in `[PATH]`.
- [ ] T0XX [VERIFY] Confirm frontend tests pass.
- [ ] T0XX [VERIFY] Run TypeScript checks.
- [ ] T0XX [VERIFY] Run production build.

Business rules SHOULD NOT live in presentation components.

---

## 12. Human Decision Traceability

Include only when applicable.

- [ ] T0XX [TEST] [AC-XXX] Add failing test proving recommendation and final human decision remain distinguishable.
- [ ] T0XX [DOMAIN] [BR-XXX] Implement approved adjustment/decision behavior.
- [ ] T0XX [APP] [FR-XXX] Implement decision recording use case.
- [ ] T0XX [INFRA] [FR-XXX] Persist required decision history.
- [ ] T0XX [VERIFY] Confirm required traceability is preserved.

Where required, preserve:

- system recommendation;
- human adjustment;
- final decision;
- responsible actor;
- timestamp;
- justification.

---

## 13. Golden / Reference Cases

Include when validated reference cases exist.

- [ ] T0XX [TEST] [BR-XXX] Add golden case `[CASE_ID]`.
- [ ] T0XX [VERIFY] Confirm calculated result matches validated expected result.

Never change a validated expected result merely to make a test pass.

---

## 14. Final Verification

- [ ] T0XX [VERIFY] Run affected domain tests.
- [ ] T0XX [VERIFY] Run affected application tests.
- [ ] T0XX [VERIFY] Run affected integration/API tests.
- [ ] T0XX [VERIFY] Run affected frontend tests.
- [ ] T0XX [VERIFY] Run golden tests when applicable.
- [ ] T0XX [VERIFY] Run the regression scope defined in `plan.md`.
- [ ] T0XX [VERIFY] Confirm all required tests pass.
- [ ] T0XX [VERIFY] Confirm architecture matches the approved plan.
- [ ] T0XX [VERIFY] Confirm no unrelated production behavior was introduced.

---

## 15. Project History

- [ ] T0XX [DOC] Update `.specify/memory/project_log.md` with factual execution results.

The entry should record:

- date;
- branch;
- feature;
- specification and plan used;
- significant files changed;
- migrations;
- tests executed and results;
- conflicts or unresolved issues;
- commit reference when available.

Implementation agents MUST NOT modify normative governance unless explicitly authorized.

---

## 16. Execution Conflicts

### EC-001 — [CONFLICT]

**Detected During:** T0XX

**Type:** BUSINESS_RULE | SPECIFICATION | ARCHITECTURE | DATA_MODEL | EXISTING_CODE | TEST | ENVIRONMENT

**Blocking:** YES | NO

**Description:**  
[DESCRIPTION]

**Resolution:**  
[REFERENCE / PENDING]

If none:

`None.`

A blocking conflict MUST NOT be resolved through assumption.

---

## 17. Completion Check

Before setting status to `COMPLETED`:

- [ ] All required tasks are complete.
- [ ] No blocking task or conflict remains.
- [ ] TDD order was followed.
- [ ] Required tests pass.
- [ ] Relevant regression tests pass.
- [ ] No business rule was invented or duplicated.
- [ ] No unapproved scope was introduced.
- [ ] Architecture matches the plan.
- [ ] Core domain remains infrastructure-independent where required.
- [ ] Golden/reference cases remain correct where applicable.
- [ ] No unintended migration was introduced.
- [ ] `project_log.md` was updated.

---

## 18. Status

**Status:** DRAFT | READY_FOR_REVIEW | APPROVED | IN_PROGRESS | COMPLETED | SUPERSEDED

**Approved By:** [NAME / ROLE / N/A]

**Approval Date:** [DATE / N/A]

**Execution Started:** [DATE / N/A]

**Execution Completed:** [DATE / N/A]

---

## Template Rules

1. Tasks execute an approved `spec.md` and `plan.md`; they do not redefine them.
2. Use exact repository paths and commands when known.
3. Keep tasks atomic and verifiable.
4. Tests precede production behavior.
5. Reference BR, FR, AC, INV, and ADR identifiers where useful.
6. Do not implement unresolved business behavior.
7. Do not introduce architecture or speculative infrastructure.
8. Omit phases that are genuinely not applicable.
9. Verification tasks are mandatory.
10. A task set with blocking conflicts cannot be completed.