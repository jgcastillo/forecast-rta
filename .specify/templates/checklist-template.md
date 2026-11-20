# Feature Readiness Checklist: [FEATURE NAME]

**Feature ID:** [FEATURE_ID]
**Status:** DRAFT
**Reviewed:** [DATE]

---

## 1. Governance

- [ ] Constitution reviewed.
- [ ] Applicable business rules identified and validated.
- [ ] Applicable ADRs identified and accepted.
- [ ] Domain terminology matches the glossary.
- [ ] No unresolved governance conflict exists.

---

## 2. Specification

- [ ] `spec.md` defines business behavior, not implementation.
- [ ] Scope and out-of-scope are explicit.
- [ ] Functional requirements are observable and testable.
- [ ] Critical requirements map to acceptance criteria.
- [ ] No blocking open question remains.
- [ ] Human decisions and system recommendations are distinguished where applicable.
- [ ] Data provenance is defined where applicable.

---

## 3. Implementation Plan

- [ ] `plan.md` implements the approved specification without changing it.
- [ ] Existing components to reuse or modify are identified.
- [ ] Architecture and dependency direction are explicit.
- [ ] Persistence and migrations are defined only where required.
- [ ] External data is normalized outside the domain.
- [ ] Testing and regression scope are defined.
- [ ] No blocking planning conflict remains.

---

## 4. Tasks

- [ ] `tasks.md` derives from the approved spec and plan.
- [ ] Tasks are atomic and verifiable.
- [ ] Relevant tasks reference BR / FR / AC / INV / ADR identifiers.
- [ ] Test tasks precede production implementation tasks.
- [ ] Exact repository paths are included where known.
- [ ] Final regression and project-log tasks are included.
- [ ] No unresolved behavior is scheduled for implementation.

---

## 5. Implementation Authorization

Implementation may begin only if:

- [ ] `spec.md` is `APPROVED`.
- [ ] `plan.md` is `APPROVED`.
- [ ] `tasks.md` is `APPROVED`.
- [ ] No blocking question or conflict remains.
- [ ] Required baseline tests are green.

**Ready for Implementation:** YES | NO

**Reviewed By:** [NAME / ROLE]

**Notes:**  
[NOTES OR NONE]