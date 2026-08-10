# Implementation Plan: [FEATURE NAME]

**Feature ID:** [FEATURE_ID]
**Status:** DRAFT
**Created:** [DATE]
**Last Updated:** [DATE]

---

## 1. Purpose

This plan defines HOW the approved feature specification will be implemented.

**Specification:** `[PATH_TO_SPEC]`

The plan MUST NOT change business requirements.

If planning reveals a missing or conflicting business rule, specification, or architectural decision, record it as a blocking conflict and stop approval.

---

## 2. References

### Normative

- Constitution: `.specify/memory/constitution.md`
- Specification: `[PATH_TO_SPEC]`
- Business Rules:
  - [BR-XXX]
- ADRs:
  - [ADR-XXX OR N/A]
- Domain Model:
  - [REFERENCE OR N/A]

### Derivative

- Data Model: [PATH OR N/A]
- Technical Contracts: [PATH OR N/A]

---

## 3. Implementation Scope

### Included

- [TECHNICAL WORK]
- [TECHNICAL WORK]

### Excluded

- [EXCLUDED WORK]

The implementation scope MUST remain within the approved specification.

---

## 4. Existing System Impact

### Reuse

- `[PATH / COMPONENT]` — [HOW IT WILL BE REUSED]

### Modify

- `[PATH / COMPONENT]` — [REQUIRED CHANGE]

### Remove / Deprecate

- `[PATH / COMPONENT OR N/A]` — [REASON]

Prefer evolutionary changes over unnecessary rewrites.

---

## 5. Architecture

**Classification:**

- [ ] Core business module
- [ ] Supporting business module
- [ ] Generic/supporting module
- [ ] Cross-cutting concern

**Module / bounded responsibility:**  
[DESCRIPTION]

**Dependency direction:**  
[EXAMPLE: Infrastructure -> Application -> Domain]

**Cross-module dependencies:**  
[DEPENDENCIES OR N/A]

**New ADR required:** YES | NO

If YES, the ADR must be accepted before this plan is approved.

---

## 6. Domain Plan

Include only when business behavior exists.

### New / Modified Concepts

#### [CONCEPT]

**Type:** Entity | Value Object | Domain Service | Policy | Other

**Responsibility:**  
[RESPONSIBILITY]

**Governed by:**  
[BR-XXX] [INV-XXX]

### Domain Constraints

- [INVARIANT]
- [INVARIANT]

For core business modules, confirm:

- [ ] No FastAPI dependency.
- [ ] No SQLModel dependency.
- [ ] No HTTP dependency.
- [ ] No spreadsheet-specific dependency.
- [ ] Business logic is independently testable.

If strict domain separation is intentionally unnecessary:

**Justification:**  
[JUSTIFICATION OR N/A]

---

## 7. Application Plan

### Use Cases

#### [USE CASE]

**Responsibility:**  
[ORCHESTRATION]

**Input:**  
[INPUT]

**Output:**  
[OUTPUT]

**Uses:**
- [DOMAIN CONCEPT]

**Ports required:**
- [PORT OR N/A]

Business rules MUST remain in the domain where applicable.

---

## 8. Infrastructure Plan

Include only relevant subsections.

### Persistence

- Models/adapters:
  - `[PATH]`
- Required change:
  - [DESCRIPTION]

### External Data / Import

- Adapter:
  - `[PATH]`
- Source:
  - [SOURCE]
- Normalization:
  - [DESCRIPTION]

External representation details MUST remain outside the domain.

### API

- Controller / route:
  - `[PATH]`
- Responsibility:
  - [TRANSPORT MAPPING / AUTHORIZATION / RESPONSE MAPPING]

Business rules MUST NOT be implemented in controllers.

---

## 9. Data and Migration

Include only when persistence changes.

### Data Changes

- [ENTITY / TABLE / MODEL]
  - Change:
  - Reason:

### Migration

**Required:** YES | NO

If YES:

- migration strategy: [DESCRIPTION]
- existing data impact: [DESCRIPTION]
- backward compatibility: [DESCRIPTION]

Do not create persistent fields for hypothetical future requirements.

---

## 10. Technical Contracts

Include only when required.

### [OPERATION]

**Method / Transport:**  
[VALUE]

**Path / Contract:**  
[VALUE]

**Input:**  
[SCHEMA]

**Output:**  
[SCHEMA]

**Maps to:**  
[FR-XXX] [AC-XXX]

**Failure mapping:**  
[BUSINESS FAILURE -> TECHNICAL RESULT]

---

## 11. Frontend Plan

Include only when applicable.

### User Flow

[HOW THE APPROVED BUSINESS SCENARIO MAPS TO UI INTERACTION]

### Reuse

- `[PATH / COMPONENT]`

### Modify

- `[PATH / COMPONENT]`

### Create

- `[PATH / COMPONENT]` — [RESPONSIBILITY]

Business logic SHOULD remain outside presentation components.

---

## 12. Security and Authorization

Include only feature-specific changes.

### Roles

- [ROLE] — [ALLOWED BEHAVIOR]

### Enforcement

[WHERE AUTHORIZATION IS ENFORCED]

Do not introduce a new authorization model without approved governance.

---

## 13. Traceability

Include when applicable.

The implementation must preserve required relationships between:

- source inputs;
- calculated results;
- system recommendations;
- human adjustments;
- final decisions.

**Technical audit impact:**  
[DESCRIPTION OR N/A]

**Business decision history impact:**  
[DESCRIPTION OR N/A]

---

## 14. Testing Strategy

Testing is mandatory.

### Domain

- `[TEST_PATH]`
- Covers: [BR-XXX] [INV-XXX] [AC-XXX]

### Application

- `[TEST_PATH]`
- Covers: [FR-XXX] [AC-XXX]

### Integration / Infrastructure

- `[TEST_PATH]`
- Covers: [FR-XXX]

### Frontend

- `[TEST_PATH OR N/A]`

### Golden / Reference Cases

- [REFERENCE OR N/A]

### Regression Scope

- [TEST SUITE]
- [TEST SUITE]

---

## 15. TDD Order

Default implementation sequence:

1. write failing test;
2. verify expected failure;
3. implement minimum behavior;
4. verify test passes;
5. run affected regression tests;
6. refactor with tests green.

For core business behavior, prefer:

1. domain tests;
2. domain implementation;
3. application tests;
4. application implementation;
5. adapter/integration tests;
6. infrastructure;
7. API/UI;
8. regression verification.

---

## 16. Implementation Sequence

### Phase 1 — [NAME]

1. [STEP]
2. [STEP]

**Exit condition:**  
[VERIFIABLE CONDITION]

### Phase 2 — [NAME]

1. [STEP]
2. [STEP]

**Exit condition:**  
[VERIFIABLE CONDITION]

Add only required phases.

---

## 17. Risks

### RISK-001 — [NAME]

**Impact:** LOW | MEDIUM | HIGH

**Likelihood:** LOW | MEDIUM | HIGH

**Mitigation:**  
[MITIGATION]

If no meaningful implementation risk exists:

`None.`

---

## 18. Compatibility

Include only when existing behavior or data is affected.

**Existing behavior affected:**  
[DESCRIPTION]

**Existing data impact:**  
[DESCRIPTION]

**Existing tests affected:**  
[DESCRIPTION]

**Rollback considerations:**  
[DESCRIPTION]

If not applicable:

`Not applicable.`

---

## 19. Planning Conflicts

### PC-001 — [CONFLICT]

**Type:** BUSINESS_RULE | SPECIFICATION | ARCHITECTURE | DATA_MODEL | EXISTING_CODE

**Blocking:** YES | NO

**Description:**  
[DESCRIPTION]

**Required resolution:**  
[DESCRIPTION]

If none:

`None.`

A blocking conflict prevents plan approval.

---

## 20. Compliance Check

Before setting status to `APPROVED`:

- [ ] Specification is approved.
- [ ] No new business rule was introduced.
- [ ] Applicable business rules are respected.
- [ ] Applicable ADRs are respected.
- [ ] No blocking planning conflict remains.
- [ ] Core domain remains infrastructure-independent where required.
- [ ] External formats remain outside the domain.
- [ ] Existing components are reused where appropriate.
- [ ] TDD and regression testing are defined.
- [ ] Golden/reference cases are considered where applicable.
- [ ] Human decisions remain distinguishable from recommendations where applicable.
- [ ] No speculative functionality or infrastructure is included.
- [ ] Implementation scope matches the specification.

---

## 21. Approval

**Status:** DRAFT | READY_FOR_REVIEW | APPROVED | SUPERSEDED

**Approved By:** [NAME / ROLE / N/A]

**Approval Date:** [DATE / N/A]

**Supersedes:** [REFERENCE / N/A]

**Superseded By:** [REFERENCE / N/A]

---

## Template Rules

1. Define HOW an approved specification will be implemented.
2. Do not change WHAT the system must do.
3. Do not invent business rules or resolve ambiguity by assumption.
4. Reference exact repository paths when known.
5. Prefer reuse over parallel abstractions or rewrites.
6. Apply strict domain isolation to core business logic.
7. Use proportional architecture for supporting modules.
8. Make testing and TDD explicit.
9. Do not introduce ADR-worthy decisions without an accepted ADR.
10. Remove unused optional sections from final plans.
11. A plan with blocking conflicts cannot be approved.