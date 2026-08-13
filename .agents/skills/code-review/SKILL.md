---
name: code-review
description: Reviews forecast_rta code changes against approved scope, architecture, business-rule boundaries, tests, migrations, and regression risk. Use after significant implementation, before completion, or when asked to review a branch or diff.
---

# Code Review

## Goal

Find material correctness, architecture, scope, and regression issues before implementation is declared complete.

## Review Order

1. Read the governing spec, plan, and relevant tasks.
2. Inspect the diff.
3. Check correctness against acceptance criteria.
4. Check for:
   - invented or duplicated business rules;
   - unapproved scope;
   - domain/infrastructure boundary violations;
   - business logic in controllers or UI;
   - unnecessary abstractions;
   - persistence changes without governance;
   - unsafe or unintended migrations;
   - missing tests;
   - weakened tests;
   - unrelated modifications.
5. Review relevant test results.
6. Check golden/reference cases when applicable.

## Output

Report findings by severity:

### BLOCKING
Correctness, governance, data-loss, security, or required-test failures.

### IMPORTANT
Architecture, maintainability, or regression risks that should be addressed before merge.

### MINOR
Useful improvements that do not block completion.

If no material findings exist, state:

`No material findings.`

## Constraints

- Review first; do not automatically rewrite code unless explicitly asked.
- Do not invent requirements during review.
- Do not treat personal style preference as a defect.
- Prefer concrete findings with exact files and evidence.
- Do not require abstractions merely for architectural purity.