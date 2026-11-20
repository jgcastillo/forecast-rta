# Feature Specification: [FEATURE NAME]

**Feature ID:** [FEATURE_ID]
**Status:** DRAFT
**Created:** [DATE]
**Last Updated:** [DATE]

---

## 1. Purpose

[Describe the business capability and why it is needed.]

Do not include implementation details.

---

## 2. References

### Normative

- Constitution: `.specify/memory/constitution.md`
- Product Requirements: [REFERENCE OR N/A]
- Business Rules:
  - [BR-XXX]
- ADRs:
  - [ADR-XXX OR N/A]
- Domain Model:
  - [REFERENCE OR N/A]

### Supporting Sources

- [CLIENT MEETING / EXCEL ANALYSIS / DISCOVERY DOCUMENT / N/A]

Supporting sources provide context but do not override normative documentation.

---

## 3. Scope

### In Scope

- [CAPABILITY]
- [CAPABILITY]

### Out of Scope

- [EXCLUDED BEHAVIOR]
- [EXCLUDED BEHAVIOR]

---

## 4. Actors

### [ACTOR]

**Responsibility:**  
[BUSINESS RESPONSIBILITY]

**Allowed interaction:**  
[WHAT THIS ACTOR MAY DO]

---

## 5. Domain Concepts

### [CONCEPT]

**Definition:**  
[BUSINESS DEFINITION]

**Relationships:**  
[RELATED DOMAIN CONCEPTS OR N/A]

Use the project's ubiquitous language.

---

## 6. Applicable Business Rules

### [BR-XXX] — [RULE NAME]

**Applies as:**  
[HOW THE RULE AFFECTS THIS FEATURE]

Reference canonical business rules instead of redefining them.

If required business behavior is not validated, the specification cannot be approved.

---

## 7. User Scenarios

### Scenario 1 — [NAME]

**Priority:** P1

**Given**
- [BUSINESS STATE]

**When**
- [ACTION]

**Then**
- [EXPECTED OUTCOME]

### Scenario 2 — [NAME]

**Priority:** P2

**Given**
- [BUSINESS STATE]

**When**
- [ACTION]

**Then**
- [EXPECTED OUTCOME]

Add only scenarios required by the feature.

---

## 8. Functional Requirements

### FR-001 — [NAME]

The system MUST [OBSERVABLE BUSINESS BEHAVIOR].

**Traceability:** [BR-XXX] [Scenario X]

### FR-002 — [NAME]

The system MUST [OBSERVABLE BUSINESS BEHAVIOR].

**Traceability:** [BR-XXX OR N/A] [Scenario X]

Functional requirements must not include:

- HTTP details;
- endpoint paths;
- database design;
- ORM types;
- framework classes;
- file paths;
- UI component names.

---

## 9. Business Validation

### VR-001 — [NAME]

**Rule:**  
[VALID / INVALID BUSINESS CONDITION]

**Expected behavior:**  
[REJECTION, WARNING, OR OTHER BUSINESS RESULT]

Do not specify transport-level error codes here.

---

## 10. Calculated Values

Include only when applicable.

### [VALUE]

**Meaning:**  
[BUSINESS MEANING]

**Inputs:**
- [INPUT]

**Rules:**
- [BR-XXX]

The specification must not invent unvalidated formulas.

---

## 11. Human Decision Points

Include only when applicable.

### [DECISION]

**System responsibility:**  
[CALCULATION / RECOMMENDATION / PRESENTATION]

**Human responsibility:**  
[DECISION / ADJUSTMENT]

**Traceability:**  
[WHAT MUST BE PRESERVED]

System recommendations and human decisions must remain distinguishable.

---

## 12. Data Provenance

Include only when relevant.

The system must distinguish applicable categories such as:

- external source data;
- imported data;
- normalized data;
- calculated data;
- manually supplied data;
- manually adjusted data.

### PR-001

[REQUIRED PROVENANCE BEHAVIOR]

---

## 13. Edge Cases

### EC-001 — [NAME]

**Condition:**  
[EDGE CONDITION]

**Expected behavior:**  
[OUTCOME]

Include only realistic business edge cases.

---

## 14. Assumptions

### A-001

[ASSUMPTION]

**Basis:**  
[VALIDATED SOURCE / ADR / PROJECT DECISION]

Unvalidated assumptions that materially affect behavior belong in the canonical open-questions document.

---

## 15. Open Questions

### OQ-[XXX] — [QUESTION]

**Impact:**  
[WHY IT MATTERS]

**Implementation Blocking:** YES | NO

**Reference:**  
[CANONICAL OPEN QUESTION]

If none:

`None.`

An implementation-blocking open question prevents specification approval.

---

## 16. Invariants

### INV-001

[DOMAIN CONDITION THAT MUST ALWAYS REMAIN TRUE]

Add only genuine domain invariants.

---

## 17. Acceptance Criteria

### AC-001

Given [BUSINESS STATE], when [ACTION], the system MUST [OBSERVABLE RESULT].

**Covers:** [FR-XXX]

### AC-002

Given [BUSINESS STATE], when [ACTION], the system MUST [OBSERVABLE RESULT].

**Covers:** [FR-XXX]

Critical functional requirements should map to acceptance criteria.

---

## 18. Non-Functional Requirements

Include only feature-specific requirements.

### Performance
[NFR OR N/A]

### Security
[NFR OR N/A]

### Auditability
[NFR OR N/A]

### Usability
[NFR OR N/A]

### Reliability
[NFR OR N/A]

Do not repeat global Constitution requirements.

---

## 19. Readiness Check

Before setting status to `APPROVED`:

- [ ] Purpose is expressed in business terms.
- [ ] Scope and out-of-scope are explicit.
- [ ] Domain terminology matches the glossary.
- [ ] Applicable business rules are referenced.
- [ ] Applicable ADRs are referenced.
- [ ] No business rule was invented inside the spec.
- [ ] No implementation-blocking open question remains.
- [ ] Functional requirements are observable and testable.
- [ ] Acceptance criteria cover critical behavior.
- [ ] Human decisions are separated from system recommendations where applicable.
- [ ] Data provenance is defined where applicable.
- [ ] No implementation technology appears in functional behavior.
- [ ] No conflict exists with higher-level governance.

---

## 20. Approval

**Status:** DRAFT | READY_FOR_REVIEW | APPROVED | SUPERSEDED

**Approved By:** [NAME / ROLE / N/A]

**Approval Date:** [DATE / N/A]

**Supersedes:** [REFERENCE / N/A]

**Superseded By:** [REFERENCE / N/A]

---

## Template Rules

1. Define WHAT the system must do and WHY.
2. Do not define HOW it will be implemented.
3. Do not invent missing business information.
4. Reference validated business rules instead of duplicating them.
5. Register unresolved material questions instead of guessing.
6. Keep requirements observable and testable.
7. Remove unused optional sections from final specifications.
8. Do not approve a specification with blocking uncertainty.