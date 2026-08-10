# Domain Model: [DOMAIN / CAPABILITY]

**Status:** DRAFT
**Created:** [DATE]
**Last Updated:** [DATE]

---

## 1. Purpose

This document defines the business concepts, relationships, responsibilities, and invariants for [DOMAIN / CAPABILITY].

It describes domain meaning.

It MUST NOT define:

- database tables;
- ORM models;
- API schemas;
- framework classes;
- persistence-specific types.

---

## 2. References

- Constitution: `.specify/memory/constitution.md`
- Business Rules:
  - [BR-XXX]
- Open Questions:
  - [OQ-XXX OR N/A]
- ADRs:
  - [ADR-XXX OR N/A]
- Discovery Sources:
  - [REFERENCE OR N/A]

---

## 3. Domain Scope

### Included

- [BUSINESS CONCEPT]
- [BUSINESS CONCEPT]
- [BUSINESS PROCESS]

### Outside This Domain

- [EXCLUDED RESPONSIBILITY]
- [EXTERNAL SYSTEM RESPONSIBILITY]

---

## 4. Ubiquitous Language

| Term | Definition |
|---|---|
| [TERM] | [BUSINESS DEFINITION] |
| [TERM] | [BUSINESS DEFINITION] |

Use one canonical term for each business concept.

---

## 5. Entities

### [ENTITY]

**Meaning:**  
[BUSINESS DEFINITION]

**Identity:**  
[WHAT MAKES THIS ENTITY DISTINCT]

**Responsibilities:**
- [RESPONSIBILITY]
- [RESPONSIBILITY]

**Governed by:**
- [BR-XXX]
- [INV-XXX]

---

## 6. Value Objects

### [VALUE OBJECT]

**Meaning:**  
[BUSINESS DEFINITION]

**Attributes:**
- [ATTRIBUTE]
- [ATTRIBUTE]

**Constraints:**
- [CONSTRAINT]

Use value objects when a concept is defined by its value rather than independent identity.

---

## 7. Relationships

- [ENTITY A] [RELATIONSHIP] [ENTITY B]
- [ENTITY] contains [VALUE OBJECT]
- [ENTITY] references [ENTITY]

Document cardinality only when business meaning requires it.

---

## 8. Domain Services / Policies

Include only when behavior does not naturally belong to a single entity or value object.

### [SERVICE / POLICY]

**Responsibility:**  
[BUSINESS RESPONSIBILITY]

**Inputs:**
- [DOMAIN CONCEPT]

**Output:**  
[DOMAIN CONCEPT / RESULT]

**Governed by:**
- [BR-XXX]

---

## 9. Invariants

### INV-001 — [NAME]

[CONDITION THAT MUST ALWAYS REMAIN TRUE]

**Source:**  
[BR-XXX / VALIDATED DOMAIN DECISION]

### INV-002 — [NAME]

[INVARIANT]

---

## 10. Domain Events

Include only when a meaningful business event must be represented.

### [EVENT]

**Meaning:**  
[WHAT HAPPENED IN BUSINESS TERMS]

**Triggered when:**  
[CONDITION]

Do not create domain events solely for technical notification purposes.

---

## 11. Lifecycle

Include only for concepts with meaningful business states.

### [ENTITY]

States:

- [STATE]
- [STATE]

Transitions:

- [STATE] -> [STATE]

**Governed by:**  
[BR-XXX]

---

## 12. System vs Human Responsibility

Include when relevant.

| Responsibility | System | Human |
|---|---|---|
| [CALCULATE / RECOMMEND / DECIDE] | [YES/NO] | [YES/NO] |

Human decisions and system-generated recommendations must remain conceptually distinct where applicable.

---

## 13. External Concepts

Document concepts owned by external systems but required by this domain.

### [EXTERNAL CONCEPT]

**Source of truth:**  
[ERP / FILE / OTHER SYSTEM]

**Used as:**  
[IMPORTED FACT / SNAPSHOT / REFERENCE]

The domain may consume external facts without becoming their system of record.

---

## 14. Open Questions

### OQ-[XXX]

[QUESTION]

**Impact:**  
[DOMAIN IMPACT]

If none:

`None.`

Blocking domain questions prevent approval.

---

## 15. Approval Check

Before setting status to `APPROVED`:

- [ ] Terminology is consistent with the glossary.
- [ ] Entities and value objects reflect business meaning.
- [ ] Relationships are explicit where relevant.
- [ ] Applicable business rules are referenced.
- [ ] Invariants are identified.
- [ ] External system responsibilities remain outside this domain.
- [ ] Human and system responsibilities are separated where relevant.
- [ ] No persistence or framework details are included.
- [ ] No blocking domain question remains.

---

## 16. Approval

**Status:** DRAFT | READY_FOR_REVIEW | APPROVED | SUPERSEDED

**Approved By:** [NAME / ROLE / N/A]

**Approval Date:** [DATE / N/A]

---

## Template Rules

1. Describe business meaning, not storage or transport.
2. Use the project's ubiquitous language.
3. Reference validated business rules rather than duplicating them.
4. Model only concepts required by the understood domain.
5. Avoid speculative entities, value objects, services, or events.
6. Keep external-system ownership explicit.
7. A model with blocking questions cannot be approved.