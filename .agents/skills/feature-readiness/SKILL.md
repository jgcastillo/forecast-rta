---
name: feature-readiness
description: Checks whether a forecast_rta feature is ready for implementation by validating its governance, specification, plan, tasks, business rules, ADRs, open questions, and baseline state. Use before starting implementation or when asked whether a feature can be implemented.
---

# Feature Readiness

## Goal

Determine whether a feature is authorized and sufficiently defined for implementation.

## Procedure

1. Identify the target feature.
2. Read its `spec.md`, `plan.md`, `tasks.md`, and checklist when present.
3. Resolve referenced business rules and ADRs.
4. Check applicable open questions.
5. Confirm:
   - spec is approved;
   - plan is approved;
   - tasks are approved;
   - required business rules are validated;
   - required ADRs are accepted;
   - no blocking question or conflict remains;
   - acceptance criteria are testable;
   - TDD tasks exist for production behavior.
6. Check the relevant existing test baseline when implementation is about to begin.

## Result

Return one of:

### READY

Briefly state why implementation may proceed.

### NOT READY

List only concrete blockers with their identifiers and required resolution.

Example:

`NOT READY`

- `OQ-007` is blocking.
- `BR-014` remains `HYPOTHESIS`.
- `plan.md` is not approved.

## Constraints

- Do not resolve business questions by assumption.
- Do not modify governance while performing readiness review.
- Do not treat `project_log.md` or `session_handoff.md` as normative.
- Do not implement the feature during this workflow.