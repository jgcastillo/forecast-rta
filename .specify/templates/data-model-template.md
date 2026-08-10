# Data Model: [FEATURE / MODULE NAME]

**Status:** DRAFT
**Created:** [DATE]
**Last Updated:** [DATE]

---

## 1. Purpose

This document defines the technical data representation required to implement the approved specification and plan.

It MUST derive from validated domain concepts and approved implementation requirements.

It MUST NOT introduce new business rules.

---

## 2. References

- Specification: `[PATH_TO_SPEC]`
- Plan: `[PATH_TO_PLAN]`
- Domain Model: `[REFERENCE OR N/A]`
- Business Rules:
  - [BR-XXX]
- ADRs:
  - [ADR-XXX OR N/A]

---

## 3. Persistence Scope

### Existing Structures to Modify

- [ENTITY / TABLE / MODEL]
  - Change:
  - Reason:

### New Structures

- [ENTITY / TABLE / MODEL]
  - Purpose:

### Out of Scope

- [EXCLUDED DATA CONCERN]

---

## 4. Entities

### [ENTITY NAME]

**Purpose:**  
[TECHNICAL PERSISTENCE PURPOSE]

**Maps to domain concept:**  
[DOMAIN CONCEPT / N/A]

| Field | Type | Required | Constraints | Meaning |
|---|---|---|---|---|
| [field] | [type] | YES/NO | [constraints] | [meaning] |

### Relationships

- [RELATIONSHIP]

### Indexes

- [INDEX OR N/A]

---

## 5. Constraints

Document database-level constraints derived from approved behavior.

- [UNIQUE CONSTRAINT]
- [FOREIGN KEY]
- [CHECK CONSTRAINT]
- [OTHER]

Database constraints MUST support domain behavior, not define undocumented business semantics.

---

## 6. Domain Mapping

For core business modules, document how persistence structures map to pure domain objects.

### [PERSISTENCE MODEL] -> [DOMAIN OBJECT]

- [field] -> [domain attribute]
- [field] -> [domain attribute]

**Mapping notes:**  
[NOTES OR N/A]

Persistence models MUST NOT automatically become domain entities.

---

## 7. Source and Derived Data

When applicable, identify data origin.

| Data | Classification | Source |
|---|---|---|
| [field/value] | SOURCE / NORMALIZED / DERIVED / MANUAL / ADJUSTED | [source] |

Derived values SHOULD NOT be persisted unless required by the approved plan.

If persisted, their authoritative inputs must remain identifiable.

---

## 8. Lifecycle and Status

Include only when records have meaningful lifecycle states.

### [ENTITY]

Allowed states:

- [STATE]
- [STATE]

Allowed transitions:

- [STATE] -> [STATE]

Lifecycle rules must reference approved business rules where applicable.

---

## 9. Migration

**Schema Migration Required:** YES | NO

If YES:

**Migration:**  
[DESCRIPTION]

**Existing Data Impact:**  
[DESCRIPTION]

**Backfill Required:** YES | NO

**Compatibility Notes:**  
[NOTES]

---

## 10. Validation Boundaries

### Database

Use for structural integrity such as:

- uniqueness;
- nullability;
- referential integrity;
- safe structural checks.

### Domain

Use for business meaning and invariants.

### Application / Import Boundary

Use for input normalization and source validation.

Avoid duplicating the same rule across layers without a concrete reason.

---

## 11. Open Data Questions

### DQ-001 — [QUESTION]

**Blocking:** YES | NO

**Reference:**  
[OQ-XXX / OTHER]

If none:

`None.`

A blocking data-model question prevents approval.

---

## 12. Approval Check

Before setting status to `APPROVED`:

- [ ] Data structures derive from approved requirements.
- [ ] No business rule was invented.
- [ ] Domain and persistence concepts are separated where required.
- [ ] Relationships and constraints are explicit.
- [ ] Source and derived data are distinguishable where applicable.
- [ ] Migration impact is understood.
- [ ] No speculative fields or tables were added.
- [ ] No blocking data question remains.

---

## 13. Approval

**Status:** DRAFT | READY_FOR_REVIEW | APPROVED | SUPERSEDED

**Approved By:** [NAME / ROLE / N/A]

**Approval Date:** [DATE / N/A]

---

## Template Rules

1. Model only data required by approved behavior.
2. Do not let persistence define domain semantics.
3. Keep framework-specific models outside the core domain.
4. Do not add fields for hypothetical future use.
5. Persist derived values only when justified by the approved plan.
6. Keep database, domain, and input validation responsibilities explicit.
7. A model with blocking questions cannot be approved.