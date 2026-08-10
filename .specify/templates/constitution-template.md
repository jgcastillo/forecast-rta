# [PROJECT_NAME] Constitution

## Purpose

This Constitution defines the stable engineering, architectural, quality, and governance principles of the **[PROJECT_NAME]** project.

It is the highest-level normative document of the project.

The Constitution MUST contain principles expected to remain stable across the lifetime of the project.

The Constitution MUST NOT contain:

- feature-specific business rules;
- business formulas;
- operational thresholds;
- product-specific attributes;
- planning horizons;
- temporary implementation decisions;
- individual user-story requirements;
- spreadsheet-specific behavior;
- mutable business policies.

Those concerns belong in domain governance, Architecture Decision Records, feature specifications, or technical plans.

---

# I. Product Boundary and Responsibility

[DEFINE THE STABLE SYSTEM RESPONSIBILITY AND ITS BOUNDARY]

This section SHOULD establish:

- the general responsibility of the system;
- what kind of system it is;
- what external systems remain authoritative;
- what types of information the system consumes or produces;
- fundamental distinctions between source facts, calculations, recommendations, and decisions.

This section MUST NOT define individual features or workflow-specific formulas.

---

# II. Human and System Responsibilities

[DEFINE HOW HUMAN DECISIONS AND SYSTEM-GENERATED OUTPUTS INTERACT]

When the product supports human decision-making, the Constitution SHOULD establish whether:

- recommendations must remain distinguishable from decisions;
- manual adjustments must be traceable;
- human judgment is an accepted part of the domain;
- automated outputs require explainability.

Do not define feature-specific approval flows here.

---

# III. Specification-Driven Development

The project follows **Specification-Driven Development (SDD)**.

Production behavior MUST originate from approved specifications and validated project governance.

Code serves the specification. The specification serves the validated domain.

Implementation MUST NOT be used as the primary mechanism for discovering or defining business behavior.

Unresolved business assumptions MUST NOT be silently converted into implementation decisions.

When implementation-critical information is ambiguous, contradictory, or unresolved, implementation MUST stop until the conflict is resolved or explicitly governed.

---

# IV. Governance and Source-of-Truth Hierarchy

Project documentation MUST be classified as:

1. **Normative**
2. **Derivative**
3. **Historical**

## A. Normative Documents

Normative documents define current required behavior, constraints, or accepted decisions.

The Constitution MUST define the precedence order for normative documents.

Recommended hierarchy:

1. Constitution
2. Accepted Architecture Decision Records
3. Validated shared domain governance
4. Approved feature specifications
5. Approved technical contracts

Lower-level normative documents MUST NOT contradict higher-level normative documents.

Detected conflicts MUST be resolved before implementation proceeds.

## B. Derivative Documents

Derivative documents describe how normative requirements will be implemented.

Examples MAY include:

- data models;
- implementation plans;
- tasks;
- API contracts;
- migration plans;
- test plans.

Derivative documents MUST NOT introduce new business rules.

## C. Historical Documents

Historical documents record previous activity or superseded knowledge.

Examples MAY include:

- project logs;
- archived specifications;
- superseded ADRs;
- obsolete stories;
- historical implementation notes.

Historical documentation MUST NOT override current normative documentation.

---

# V. Domain Knowledge Governance

Shared business concepts and rules MUST be documented separately from individual feature specifications when they apply across multiple capabilities.

The domain governance layer SHOULD contain, where appropriate:

- glossary / ubiquitous language;
- business rules;
- domain model;
- process models;
- assumptions;
- open questions.

Business rules SHOULD use explicit identifiers.

Business-rule lifecycle states SHOULD distinguish at minimum:

- hypotheses;
- validated rules;
- superseded rules.

Unvalidated hypotheses MUST NOT silently become production behavior.

Feature specifications SHOULD reference shared business rules instead of duplicating them.

---

# VI. Architecture

[DEFINE THE STABLE ARCHITECTURAL STYLE]

This section SHOULD define:

- system-level architectural style;
- module organization principles;
- dependency direction;
- core-domain isolation requirements;
- allowed simplifications for supporting modules.

Architecture rules SHOULD be proportional to business complexity.

The Constitution SHOULD prohibit accidental complexity and unnecessary abstractions.

Architecture MUST serve the domain rather than force the domain into arbitrary technical structures.

---

# VII. Domain and Infrastructure Separation

[DEFINE DOMAIN ISOLATION REQUIREMENTS]

Where a core business domain exists:

- domain logic SHOULD remain independent of frameworks;
- infrastructure-specific persistence models MUST NOT automatically be treated as domain entities;
- external formats MUST be translated into normalized domain concepts;
- domain behavior SHOULD be independently testable.

Persistence design MUST NOT become the source of business semantics.

The domain model SHOULD drive persistence design rather than the reverse.

---

# VIII. Technology Governance

[DEFINE THE APPROVED BASELINE TECHNOLOGY STACK]

The Constitution MAY define stable technology choices such as:

- programming languages;
- core frameworks;
- persistence technology;
- frontend stack;
- infrastructure tooling;
- testing frameworks.

Technology-specific version numbers SHOULD NOT be constitutional unless compatibility requires them.

A blanket "always use the latest version" requirement SHOULD be avoided.

Dependencies SHOULD use maintained, stable versions compatible with the project.

Material changes to core technology choices SHOULD require an accepted ADR.

---

# IX. Development Environment

[DEFINE REPRODUCIBLE DEVELOPMENT AND EXECUTION REQUIREMENTS]

This section MAY establish requirements for:

- containerized development;
- environment parity;
- configuration management;
- secret handling;
- reproducible testing.

Secrets MUST NOT be committed to source control.

---

# X. Test-Driven Development

[DEFINE THE PROJECT TESTING DISCIPLINE]

If TDD is mandatory, the Constitution MUST state it explicitly.

Recommended cycle:

1. derive expected behavior from approved requirements;
2. write or update the relevant test;
3. verify that the new test fails for the expected reason;
4. implement the minimum production behavior;
5. verify that the test passes;
6. run the relevant regression suite;
7. refactor while tests remain green.

If testing is declared mandatory, lower-level templates MUST NOT describe tests as optional.

Exceptions MUST require explicit justification.

---

# XI. Business Correctness

Business-critical behavior MUST receive direct automated test coverage.

Where validated real-world reference cases exist, they SHOULD be preserved as golden or reference tests.

The Constitution SHOULD distinguish between:

- domain calculation tests;
- application tests;
- integration tests;
- contract tests;
- user-interface tests.

Code coverage alone MUST NOT be considered proof of business correctness.

Validated domain behavior takes precedence over arbitrary coverage metrics.

---

# XII. Derived Data and Reproducibility

[DEFINE HOW DERIVED VALUES RELATE TO SOURCE DATA]

Derived values SHOULD remain reproducible from:

- authoritative source inputs;
- applicable business rules;
- relevant configuration.

The Constitution SHOULD avoid prescribing a specific recalculation mechanism unless that mechanism is itself a stable architectural requirement.

Feature specifications or ADRs SHOULD define whether recalculation is synchronous, asynchronous, automatic, or user-triggered.

---

# XIII. Explainability and Traceability

[DEFINE TRACEABILITY EXPECTATIONS]

For decision-support or business-critical systems, the Constitution SHOULD define expectations for tracing:

- source inputs;
- applied rules;
- relevant configuration;
- calculated outputs;
- recommendations;
- human adjustments;
- final decisions.

Technical audit logging and business decision history SHOULD be treated as separate concepts when they serve different purposes.

---

# XIV. External Data Boundaries

External files, APIs, and datasets MUST be treated as untrusted inputs.

Adapters MUST validate external data before it enters business calculations.

Where relevant, ingestion SHOULD distinguish between:

- raw data;
- normalized data;
- rejected records;
- warnings;
- accepted records.

Domain logic MUST NOT depend directly on external representation details such as:

- spreadsheet coordinates;
- spreadsheet formatting;
- external column names;
- transport-specific payload structures.

External representation knowledge belongs at system boundaries.

---

# XV. Specification and Technical Contract Separation

Functional specifications MUST remain technology-agnostic.

Functional specifications SHOULD describe:

- business behavior;
- user outcomes;
- rules;
- constraints;
- acceptance behavior.

They MUST NOT define technical transport or persistence details such as:

- HTTP status codes;
- endpoint paths;
- framework classes;
- ORM types;
- SQL constraints;
- database indexes.

Those details belong in derivative technical documentation.

---

# XVI. Simplicity and Proportional Architecture

The project SHOULD favor:

- high cohesion;
- low coupling;
- explicit dependencies;
- YAGNI;
- evolutionary design;
- minimal accidental complexity.

The following SHOULD require explicit justification:

- speculative abstractions;
- unnecessary interfaces;
- unnecessary factories;
- unnecessary service layers;
- premature distributed architecture;
- duplicated business rules;
- generic infrastructure created solely for hypothetical future use.

Architectural patterns MUST be used to reduce complexity, not to maximize architectural ceremony.

---

# XVII. Change Control

[DEFINE THE ORDER IN WHICH VALIDATED CHANGE FLOWS THROUGH GOVERNANCE AND CODE]

Recommended sequence for business-behavior changes:

1. update applicable domain knowledge;
2. update or create ADRs when architectural decisions change;
3. update affected feature specifications;
4. update technical plans;
5. update implementation tasks;
6. update tests;
7. update production code;
8. verify regression behavior;
9. update historical project records.

Existing code MUST NOT be considered proof that historical behavior remains correct after governing requirements change.

---

# XVIII. Implementation Agent Responsibilities

When AI implementation agents are used, their authority MUST be explicitly bounded.

Implementation agents SHOULD:

- read applicable governance before coding;
- obey normative-document precedence;
- identify conflicts before implementation;
- implement only approved scope;
- follow required testing discipline;
- preserve architecture boundaries;
- execute required verification;
- update historical execution records factually.

Implementation agents MUST NOT independently:

- invent business rules;
- resolve unresolved domain questions;
- redefine product scope;
- modify normative governance;
- introduce unsupported functionality;
- make unapproved architectural changes;
- treat historical documentation as normative authority.

---

# XIX. Documentation Language

[DEFINE THE PROJECT DOCUMENTATION LANGUAGE POLICY]

The policy MAY distinguish between:

- technical normative documentation;
- source code;
- technical comments;
- client discovery material.

Discovery material MAY remain in the language in which it was captured when appropriate.

Validated knowledge MUST be incorporated into the project's normative technical documentation using the project's approved technical language before implementation.

---

# XX. Quality Gates

Before implementation begins, the applicable specification set SHOULD confirm that:

- relevant domain rules are identified;
- relevant ADRs are identified;
- implementation-critical questions are resolved;
- acceptance behavior is testable;
- scope is explicit;
- out-of-scope behavior is explicit;
- terminology is consistent;
- no unresolved governance conflicts exist;
- functional specifications remain technology-agnostic.

Before implementation is considered complete:

- required tests MUST pass;
- relevant regression tests MUST pass;
- architecture boundaries MUST remain valid;
- undocumented business behavior MUST NOT have been introduced;
- historical execution records MUST be updated when required.

---

# Governance

This Constitution supersedes all lower-level project documentation.

Lower-level documentation that conflicts with the Constitution MUST be corrected, superseded, or explicitly migrated.

Constitution amendments require:

1. an explicit proposed change;
2. documented rationale;
3. impact analysis;
4. version increment;
5. amendment date.

Constitution changes SHOULD be rare.

Normal changes in business rules or feature behavior SHOULD generally modify domain governance or feature specifications instead of this Constitution.

## Versioning

Constitution versions SHOULD follow semantic intent:

- **MAJOR** — fundamental governance or architectural philosophy changes;
- **MINOR** — addition or meaningful expansion of governance principles;
- **PATCH** — clarification without material governance change.

**Version:** [CONSTITUTION_VERSION]
**Ratified:** [RATIFICATION_DATE]
**Last Amended:** [LAST_AMENDED_DATE]