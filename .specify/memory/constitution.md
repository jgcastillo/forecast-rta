# forecast_rta Constitution

## Purpose

This Constitution defines the stable engineering, architectural, quality, and governance principles of the **forecast_rta** project.

It is the highest-level normative document of the project.

The Constitution MUST remain independent from feature-specific business rules, formulas, thresholds, product attributes, planning horizons, operational exceptions, or temporary implementation decisions.

Business behavior belongs in the domain governance layer and feature specifications, not in this document.

---

# I. Product Boundary and Responsibility

`forecast_rta` is a decision-support software system.

The application MUST NOT become the operational system of record for business processes already managed by external systems unless such responsibility is explicitly introduced through an approved architectural decision.

External operational data MAY be imported and represented by `forecast_rta` for analysis, planning, simulation, recommendation, and decision-support purposes.

The system MUST clearly distinguish between:

- externally sourced facts;
- imported snapshots;
- calculated values;
- configured business policies;
- system-generated recommendations;
- human adjustments;
- final human decisions.

These concepts MUST NOT be silently merged into a single value when their provenance or meaning differs.

---

# II. Human-in-the-Loop Decision Principle

The system exists to support expert decision-making, not to silently replace it.

System-generated calculations and recommendations MUST remain distinguishable from decisions made or modified by authorized users.

When an authorized user overrides or adjusts a recommendation, the system SHOULD preserve, whenever relevant:

- the original system recommendation;
- the final human decision;
- the magnitude or nature of the adjustment;
- the responsible user;
- the timestamp;
- the stated reason or observation.

Manual intervention that affects planning or decision outcomes MUST be explicit and traceable.

Business-relevant expert judgment is considered part of the domain and MUST NOT be treated as an implementation defect or bypass of business logic.

---

# III. Specification-Driven Development

The project follows **Specification-Driven Development (SDD)**.

Production behavior MUST originate from approved specifications and validated project governance.

Code serves the specification. The specification serves the validated domain.

Implementation MUST NOT be used as the primary mechanism for discovering or defining business behavior.

Unresolved business assumptions MUST NOT be silently converted into implementation decisions.

If information required for implementation is ambiguous, contradictory, or unresolved, the implementation agent MUST report the conflict rather than invent a rule.

---

# IV. Governance and Source-of-Truth Hierarchy

Project documentation is divided into three categories.

## A. Normative Documents

Normative documents define behavior or constraints that implementation MUST follow.

Their precedence is:

1. `.specify/memory/constitution.md`
2. Accepted Architecture Decision Records under `.specify/decisions/`
3. Validated domain rules under `.specify/domain/`
4. Approved feature specifications under `.specify/modules/`
5. Approved technical contracts associated with those specifications

A lower-level document MUST NOT contradict a higher-level normative document.

When contradictions are detected, implementation MUST stop until the conflict is resolved.

## B. Derivative Documents

Derivative documents describe how approved normative requirements will be implemented.

Examples include:

- `data-model.md`
- `plan.md`
- `tasks.md`
- API contracts
- migration plans
- test plans

Derivative documents MUST trace back to normative requirements.

They MUST NOT introduce new business rules.

## C. Historical Documents

Historical documents record what happened but do not define current required behavior.

Examples include:

- `.specify/memory/project_log.md`
- archived specifications;
- superseded ADRs;
- obsolete user stories;
- historical implementation notes.

Historical documents MUST NEVER override current normative documentation.

`project_log.md` is an execution history, not a source of business truth.

---

# V. Domain Knowledge Governance

Shared business concepts and rules MUST be documented outside individual feature specifications when they apply across multiple capabilities.

The domain governance layer SHOULD include, as applicable:

- ubiquitous language / glossary;
- business rules;
- domain model;
- process descriptions;
- open questions;
- validated assumptions.

Business rules MUST have explicit identifiers and lifecycle status where practical.

Recommended statuses are:

- `HYPOTHESIS`
- `VALIDATED`
- `SUPERSEDED`

A rule marked as a hypothesis MUST NOT be treated as confirmed business behavior unless an approved specification explicitly defines how that uncertainty is handled.

Feature specifications SHOULD reference existing business-rule identifiers instead of duplicating the rules.

---

# VI. Architecture

The backend MUST be implemented as a **Modular Monolith** unless an accepted ADR explicitly changes that decision.

Modules SHOULD be organized around cohesive business capabilities rather than technical layers alone.

The architecture follows **Hexagonal Architecture / Ports and Adapters** and Domain-Driven Design principles where they provide meaningful isolation and maintainability.

## Core Business Modules

Modules containing essential planning, calculation, recommendation, or decision logic MUST enforce strict separation between:

### Domain

Contains:

- business entities;
- value objects;
- domain services;
- calculation rules;
- policies;
- domain invariants.

The core domain MUST remain independent of:

- FastAPI;
- SQLModel;
- PostgreSQL;
- HTTP;
- React;
- spreadsheet libraries;
- infrastructure frameworks.

Domain calculations SHOULD be executable as ordinary deterministic Python code wherever possible.

### Application

Contains:

- use cases;
- orchestration;
- input ports;
- output ports;
- transaction boundaries where appropriate.

The application layer coordinates domain behavior but SHOULD NOT contain business rules that belong in the domain.

### Infrastructure

Contains adapters such as:

- FastAPI controllers;
- SQLModel persistence models;
- PostgreSQL repositories;
- spreadsheet parsers;
- external service clients;
- framework configuration.

Infrastructure MAY depend on application and domain abstractions.

Domain code MUST NOT depend on infrastructure.

## Supporting Modules

Supporting or generic modules MAY use a simplified architectural structure when strict layer separation would create ceremony without meaningful benefit.

Any deliberate architectural simplification MUST preserve:

- testability;
- clear dependency direction;
- separation of business logic from infrastructure concerns.

Architecture exists to reduce complexity, not to manufacture it.

---

# VII. Persistence and Domain Separation

Persistence models are infrastructure concerns.

Framework-specific models such as SQLModel entities MUST NOT automatically be considered domain entities.

For core business modules, persistence representations SHOULD be separated from pure domain models when doing so protects domain independence.

Mappings between domain objects and persistence representations MAY be explicit when required.

Database schema decisions MUST NOT define business semantics by themselves.

The domain model drives persistence design, not the reverse.

---

# VIII. Technology Stack

The approved baseline technology stack is:

## Backend

- Python
- FastAPI
- Pydantic
- SQLModel
- Alembic

## Database

- PostgreSQL

## Frontend

- React
- Vite
- TypeScript
- Tailwind CSS

## Infrastructure

- Docker
- Docker Compose
- Git
- GitHub

## Testing

- Pytest for backend testing
- Vitest / React Testing Library for frontend testing

Changes to core technology choices require an accepted ADR.

Dependencies SHOULD use maintained, stable versions compatible with the project.

The project MUST NOT upgrade dependencies merely to satisfy a "latest version" policy when doing so creates unnecessary instability.

---

# IX. Container-First Development

Development and verification MUST be reproducible using Docker and Docker Compose.

The containerized environment is the canonical execution environment for development, testing, and integration.

Local host tools MAY be used for auxiliary work, but successful host-only execution MUST NOT substitute container verification.

Environment-specific configuration MUST be externalized.

Secrets MUST NOT be committed to source control.

---

# X. Test-Driven Development

TDD is mandatory for production behavior.

The normal implementation cycle is:

1. derive expected behavior from approved specifications;
2. write or update the corresponding test;
3. verify that the new or modified test fails for the expected reason;
4. implement the minimum production behavior required;
5. verify that the test passes;
6. run the relevant regression suite;
7. refactor while maintaining green tests.

Tests are NOT optional implementation artifacts.

Exceptions to test-first execution require explicit justification and MUST NOT be silently assumed by an implementation agent.

---

# XI. Business Rule Testing

Business-critical calculations MUST receive direct automated test coverage.

Where reliable historical examples or client-validated reference cases exist, they SHOULD be preserved as reference or golden test cases.

Tests SHOULD distinguish between:

- calculation correctness;
- application orchestration;
- persistence behavior;
- API contracts;
- user-interface behavior.

High test coverage alone is not considered proof of business correctness.

Correctness against validated business rules and representative business scenarios has priority.

---

# XII. Recalculation and Derived Data

Derived values MUST be reproducible from their authoritative source inputs and applicable business rules.

When relevant source information changes, dependent calculations MUST be capable of being recalculated.

This Constitution does NOT prescribe whether recalculation must occur:

- synchronously;
- automatically;
- on save;
- on demand;
- through background processing.

That behavior belongs to the relevant specification and architecture decision.

Derived values MUST NOT become unexplained independent sources of truth.

---

# XIII. Explainability and Traceability

Business-critical recommendations and calculations SHOULD be explainable.

Where a user must trust or act upon a system-generated recommendation, the system SHOULD make available the relevant contributing factors when practical.

Traceability SHOULD allow the project to answer questions such as:

- Which source data was used?
- Which business rules were applied?
- Which configuration influenced the result?
- What did the system recommend?
- Did a user modify the recommendation?
- What final decision was recorded?

Technical audit logging and business decision history are distinct concepts and SHOULD be modeled separately when their purposes differ.

---

# XIV. Data Import Boundaries

Imported files and external datasets are untrusted inputs.

Import adapters MUST validate incoming data before it becomes available to business calculations.

Import processing SHOULD distinguish between:

- raw source values;
- normalized values;
- rejected records;
- validation warnings;
- accepted records.

Domain logic MUST NOT depend directly on spreadsheet coordinates, column letters, formatting, formulas, or workbook layout.

Spreadsheet-specific knowledge belongs in import adapters.

The domain MUST operate on normalized business concepts.

---

# XV. API and Contract Boundaries

Functional specifications MUST remain technology-agnostic.

They MUST describe expected behavior rather than transport implementation.

Technology-specific details such as:

- HTTP methods;
- HTTP status codes;
- endpoint paths;
- Pydantic schemas;
- SQL constraints;
- ORM types;

belong in technical contracts, data models, or implementation plans.

Public or module-facing contracts MUST be validated at system boundaries.

---

# XVI. Simplicity and Proportional Architecture

The project follows the principles of:

- high cohesion;
- low coupling;
- explicit dependencies;
- YAGNI;
- evolutionary design;
- minimal accidental complexity.

The following are prohibited unless justified by actual requirements:

- speculative abstractions;
- unnecessary repository interfaces;
- unnecessary factories;
- unnecessary service layers;
- premature microservices;
- duplicated domain rules;
- generic infrastructure created solely for hypothetical future use.

DDD and Hexagonal Architecture MUST be used to clarify the business domain, not to maximize the number of architectural artifacts.

---

# XVII. Change Control

Business behavior MUST NOT be changed directly in production code without first updating the appropriate normative documentation.

When validated business understanding changes, the expected sequence is:

1. update the relevant business rule or domain document;
2. create or update an ADR when an architectural decision changes;
3. update affected feature specifications;
4. update implementation plans;
5. update tasks;
6. modify tests;
7. modify production code;
8. verify regression tests;
9. update the project log.

Existing implementation MUST NOT be treated as evidence that historical behavior remains correct after the governing specification changes.

---

# XVIII. Implementation Agent Responsibilities

AI implementation agents MUST operate as implementation assistants, not autonomous product owners or domain authorities.

An implementation agent MUST:

- read the applicable governance before coding;
- obey normative-document precedence;
- identify conflicts before implementation;
- follow approved specifications, plans, and tasks;
- follow TDD;
- preserve architectural boundaries;
- run the required test suites;
- report unresolved contradictions;
- update `project_log.md` factually after completed assignments.

An implementation agent MUST NOT:

- invent business rules;
- silently resolve open domain questions;
- redefine product scope;
- modify normative governance without explicit instruction;
- add functionality not supported by an approved specification;
- change architecture merely because another pattern appears preferable;
- treat historical documentation as current authority.

---

# XIX. Documentation Language

Code identifiers, technical specifications, implementation plans, tasks, ADRs, domain governance documents, and technical comments MUST be written in English.

Client discovery material MAY remain in the language in which it was captured.

Validated knowledge derived from discovery material MUST be incorporated into normative technical documentation in English before implementation.

---

# XX. Quality Gate

Before a feature enters implementation, the responsible specification set MUST demonstrate that:

- applicable business rules are identified;
- relevant ADRs are identified;
- business-critical assumptions are resolved;
- acceptance behavior is testable;
- scope and out-of-scope behavior are explicit;
- domain terminology is consistent;
- no known higher-level governance conflict exists;
- implementation details have not leaked into technology-agnostic specifications.

Before an implementation is considered complete:

- required tests pass;
- relevant regression tests pass;
- architecture boundaries remain valid;
- no undocumented business behavior has been introduced;
- project history is updated.

---

# Governance

This Constitution supersedes all lower-level project documentation.

Any conflicting lower-level rule MUST be changed or formally superseded.

Amendments to this Constitution require:

1. an explicit proposed change;
2. a stated rationale;
3. analysis of affected governance or implementation;
4. version increment;
5. documented amendment date.

Constitution changes SHOULD be rare.

Changes to normal business behavior SHOULD generally modify domain governance or feature specifications rather than this Constitution.

## Versioning

Constitution versions follow semantic intent:

- **MAJOR** — fundamental governance or architectural philosophy changes;
- **MINOR** — addition or meaningful expansion of a principle;
- **PATCH** — clarification that does not materially change governance.

**Version:** 2.0.0
**Ratified:** 2026-08-10
**Last Amended:** 2026-08-10