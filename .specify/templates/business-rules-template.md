# Business Rules: [DOMAIN / CAPABILITY]

**Status:** DRAFT
**Created:** [DATE]
**Last Updated:** [DATE]

---

## Purpose

This document is the canonical source for validated and proposed business rules within [DOMAIN / CAPABILITY].

Feature specifications SHOULD reference rule identifiers instead of redefining these rules.

---

## Rule Status

Use:

- `HYPOTHESIS` — plausible but not yet validated.
- `VALIDATED` — confirmed and safe to use in approved specifications.
- `SUPERSEDED` — no longer applicable; retained for traceability.

Only `VALIDATED` rules may define production behavior.

---

## Rules

### BR-001 — [RULE NAME]

**Status:** HYPOTHESIS | VALIDATED | SUPERSEDED

**Rule:**  
[CONCISE BUSINESS RULE]

**Applies to:**  
[DOMAIN CONCEPT / PROCESS]

**Source:**  
[CLIENT MEETING / DOCUMENT / VALIDATED EXAMPLE / DECISION]

**Notes:**  
[ONLY IF REQUIRED]

---

### BR-002 — [RULE NAME]

**Status:** HYPOTHESIS | VALIDATED | SUPERSEDED

**Rule:**  
[CONCISE BUSINESS RULE]

**Applies to:**  
[DOMAIN CONCEPT / PROCESS]

**Source:**  
[SOURCE]

---

## Supersession

When a rule changes, do not silently rewrite its history.

Mark the previous rule `SUPERSEDED` and reference the replacement:

**Superseded By:** [BR-XXX]

The new rule SHOULD reference:

**Supersedes:** [BR-XXX]

---

## Rules

1. One identifier represents one business rule.
2. Rules describe business behavior, not implementation.
3. Do not include HTTP, database, framework, or UI details.
4. Do not convert uncertainty into a validated rule.
5. Material unresolved questions belong in `open-questions.md`.
6. Avoid duplicating the same rule across domain documents or feature specs.