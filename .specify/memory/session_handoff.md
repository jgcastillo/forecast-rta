# Project Session Handoff — forecast_rta

**Status:** ACTIVE
**Updated:** 2026-08-11
**Current Branch:** `refactor/governance-domain-realignment`
**Last Relevant Commit:** `1948fc11adb8a0275c87d81fffa40087335f8a03`

> This document is operational context only.
> It is NOT normative and MUST NOT override the Constitution, accepted ADRs, validated business rules, approved domain documentation, or approved feature specifications.

---

## 1. Current Objective

Realign the project's governance, product definition, domain documentation, and implementation workflow before resuming feature development.

The goal is to preserve useful existing code while preventing outdated assumptions from becoming embedded in the core planning domain.

---

## 2. Product Understanding

`forecast_rta` is a decision-support system for procurement planning and future product availability.

It is NOT intended to replace the ERP or become an inventory-management, warehouse-management, accounting, or purchasing-execution system.

The ERP remains the operational system of record.

The application consumes ERP-derived data and supports:

- demand analysis;
- future availability planning;
- inbound supply consideration;
- purchase recommendations;
- expert review and adjustment;
- final procurement decisions;
- explainability and traceability.

The system supports human judgment rather than replacing it.

---

## 3. Current Business Understanding

The existing business process relies heavily on complex Excel workbooks and expert knowledge.

Relevant planning inputs include:

- product information;
- historical sales;
- location-specific stock/position data;
- incoming/transit quantities;
- demand averages and trends;
- operational constraints;
- expert observations and adjustments.

Important findings from client discovery include:

- two Miami warehouses exist: Domestic and Bonded;
- Puerto Rico is also relevant to planning;
- product compatibility may span equipment series such as S2, S3, S4, S5, and combinations;
- products are purchased in boxes and quantity-per-box matters;
- pallet information may matter operationally, but its purpose is not yet validated;
- availability and projection logic depends on location-specific data;
- planning spans multiple future months;
- seasonal and logistics constraints may affect procurement timing;
- manual comments and overrides contain business knowledge and must not be treated as noise.

Exact formulas, thresholds, and operational rules must be validated before becoming production behavior.

---

## 4. Key Decisions Already Made

### Product

- `forecast_rta` is a decision-support system, not an ERP replacement.
- Human procurement decisions remain distinct from system recommendations.
- Expert adjustments are legitimate domain behavior and should be traceable.
- The planning horizon must not be structurally limited to a fixed number of months.

### Governance

Project documentation is classified as:

- Normative
- Derivative
- Historical / operational

Normative precedence is:

1. Constitution
2. Accepted ADRs
3. Validated domain governance
4. Approved feature specifications
5. Approved technical contracts

Derivative documents include implementation plans, tasks, and technical data models.

Historical/operational documents include `project_log.md` and this handoff file.

### Architecture

- Backend remains a Modular Monolith.
- Core planning/business logic must remain framework-independent.
- Hexagonal Architecture and DDD are strict where they protect core business logic.
- Supporting modules may use simpler architecture when additional ceremony provides no meaningful benefit.
- Persistence models must not automatically become domain models.
- External spreadsheet structure must remain outside the core domain.

### Development

- SDD remains the governing workflow.
- TDD is mandatory for production behavior.
- Gemini is an implementation agent, not a product or domain authority.
- Gemini must not invent business rules or silently resolve unresolved questions.
- `project_log.md` remains historical and must not become normative.

---

## 5. Documentation Completed

The following governance work has been completed on the current branch.

### Constitution

Updated:

`/.specify/memory/constitution.md`

The Constitution was rewritten to remove volatile business formulas and feature-specific rules.

### Templates

Created or rewritten:

- `.specify/templates/constitution-template.md`
- `.specify/templates/spec-template.md`
- `.specify/templates/plan-template.md`
- `.specify/templates/tasks-template.md`
- `.specify/templates/checklist-template.md`
- `.specify/templates/business-rules-template.md`
- `.specify/templates/open-questions-template.md`
- `.specify/templates/adr-template.md`
- `.specify/templates/data-model-template.md`
- `.specify/templates/domain-model-template.md`
- `.specify/templates/glossary-template.md`

Removed:

- `.specify/templates/agent-file-template.md`

The obsolete agent template was removed because agent governance should live in `GEMINI.md`, `ANTIGRAVITY.md`, and the project governance hierarchy.

### Product Documentation

Rewritten:

`docs/prd.md`

The PRD now focuses on:

- product vision;
- problem;
- users;
- capabilities;
- product boundaries;
- human-in-the-loop decision support;
- ERP-derived data;
- MVP direction;
- success outcomes.

It intentionally excludes detailed formulas, architecture, persistence, and implementation rules.

### Obsolete Documentation

Removed:

`docs/user-stories/US-01-user-registration.md`

The duplicate `docs/user-stories/` content was removed because the authentication module already contains its governed specification.

---

## 6. Git State

Current working branch:

`refactor/governance-domain-realignment`

Relevant commit:

`1948fc11adb8a0275c87d81fffa40087335f8a03`

Commit message:

`refactor: realign project governance and documentation`

The branch should NOT be merged to `main` yet.

The remaining governance/domain realignment should be completed first.

---

## 7. Existing Code State

Existing implementation should be evolved rather than discarded.

Already implemented capabilities include:

- authentication;
- user management;
- product/catalog functionality;
- historical sales functionality;
- backend/API/frontend tests for existing modules.

Authentication was intentionally implemented early because different business users have different responsibilities.

Existing code must be reviewed against the new governance before deciding what requires modification.

No production code should be changed during the current documentation realignment unless explicitly planned later.

---

## 8. Existing Conceptual Risks

The current repository contains historical assumptions that may no longer represent validated business behavior.

Known areas requiring review include:

- fixed 12-month / 6-month forecasting assumptions;
- fixed availability thresholds or lead times;
- fixed two-month projection logic;
- inventory-management-like stories that may belong to the ERP instead;
- old role terminology;
- persistence models that may mix domain and SQLModel concerns;
- roadmap stories based on earlier product assumptions.

Historical implementation must not be treated as proof that those assumptions remain correct.

---

## 9. Domain Documentation Still Required

The templates exist, but the real project domain documents have not yet been created.

Expected domain governance includes at least:

- `.specify/domain/glossary.md`
- `.specify/domain/business-rules.md`
- `.specify/domain/open-questions.md`
- `.specify/domain/domain-model.md`

These documents should be created from validated client knowledge before implementing core planning logic.

---

## 10. Important Open Business Questions

Examples currently requiring validation include:

- What exactly does `minimum quantity = 0` mean?
- Is product lifecycle/status separate from planning minimum quantity?
- What operational purpose does boxes-per-pallet serve?
- What is the exact month-to-month projection formula?
- Which stock locations are included in each planning calculation?
- Which sales locations are included in each demand calculation?
- How are transit quantities applied to projected periods?
- Which demand signals are used and how are they combined?
- Which seasonal/logistics constraints are formal rules versus expert judgment?
- Which planning horizon is required for the MVP?
- Which purchase recommendation rules are automatic versus manually adjusted?

These questions must not be resolved through implementation assumptions.

---

## 11. Initial ADRs Expected

Likely ADR candidates include:

- ERP remains the operational system of record.
- Procurement decisions remain human-in-the-loop.
- Planning horizon is configurable rather than fixed in code or schema.
- Core planning domain remains framework-independent.

These ADRs have not yet been formally created.

---

## 12. Next Recommended Steps

Continue in this order:

1. Review and rewrite `GEMINI.md`.
2. Review and rewrite `ANTIGRAVITY.md`.
3. Create the real domain glossary.
4. Create the canonical open-questions document.
5. Convert validated findings into business rules.
6. Create the initial domain model.
7. Create and accept required ADRs.
8. Reassess the existing roadmap / `stories.md`.
9. Define the new MVP sequence.
10. Perform a gap analysis between approved governance/domain and existing implementation.
11. Only then create implementation branches for required code changes.

Do not resume core planning implementation before these steps are sufficiently complete.

---

## 13. Working Agreement

### ChatGPT

Responsible for helping define and review:

- governance;
- product/domain structure;
- business rules;
- open questions;
- ADRs;
- specifications;
- implementation plans;
- tasks;
- prompts for implementation work.

ChatGPT should challenge ambiguous or weak design decisions rather than simply confirm them.

### User

Responsible for:

- reviewing proposed documentation;
- copying approved content into the repository;
- managing Git branches, commits, and merges;
- validating business understanding with the client.

### Gemini

Responsible for:

- implementing approved work;
- following the approved spec, plan, and tasks;
- following TDD;
- running tests;
- reporting conflicts;
- updating `.specify/memory/project_log.md` factually after implementation.

Gemini must not independently redefine governance, product scope, architecture, or business rules.

---

## 14. Resume Instruction

At the beginning of a future session:

1. Read this file first.
2. Read `.specify/memory/constitution.md`.
3. Read `docs/prd.md` when product scope is relevant.
4. Read only the domain rules, ADRs, specs, plans, and tasks relevant to the current work.
5. Treat `project_log.md` and this file as historical/operational context, not normative authority.
6. Continue from the "Next Recommended Steps" section unless newer repository governance supersedes it.

Update this handoff after significant sessions or major project decisions.

Replace outdated current-state information instead of accumulating a chronological conversation log.