# Product Requirements Document — forecast_rta

**Status:** DRAFT
**Version:** 2.0
**Last Updated:** 2026-08-10

---

## 1. Product Vision

`forecast_rta` is a decision-support system for procurement planning and future product availability.

Its purpose is to transform ERP-derived operational data, historical sales, inbound supply information, and expert business judgment into reproducible planning outputs and explainable purchase recommendations.

The system supports decision-making. It does not replace the final judgment of the responsible business user.

---

## 2. Problem Statement

The current planning process depends heavily on complex Excel workbooks and expert manual analysis.

Preparing the information, reviewing sales behavior, calculating availability, considering incoming merchandise, and defining purchase quantities can require several days of work.

Relevant business knowledge is also embedded in:

- spreadsheet formulas;
- historical calculations;
- manual adjustments;
- comments and observations;
- expert operational judgment.

This creates:

- high manual effort;
- dependency on specific individuals;
- difficulty reproducing prior decisions;
- limited explainability;
- risk of inconsistent calculations;
- slow procurement analysis.

`forecast_rta` should make this process faster, more reproducible, and easier to understand without removing expert judgment.

---

## 3. Product Goals

The product should:

- reduce manual preparation of procurement analysis;
- centralize the information required for planning;
- make recurring calculations reproducible;
- evaluate future product availability across a configurable planning horizon;
- generate explainable procurement recommendations;
- preserve relevant expert adjustments and observations;
- distinguish system-generated recommendations from final human decisions;
- improve traceability of how procurement decisions were reached;
- reduce dependence on undocumented spreadsheet knowledge.

---

## 4. Users and Responsibilities

### Administrator

Responsible for system administration and access management.

Typical responsibilities include:

- managing users;
- managing permissions;
- maintaining system-level configuration where authorized.

### Data Operator / Analyst

Responsible for preparing and loading the operational information required by the planning process.

Typical responsibilities include:

- importing ERP-derived data;
- reviewing import results;
- correcting source-data issues outside the system when necessary;
- ensuring required planning inputs are available.

### Planner / Decision Maker

Responsible for reviewing planning results and making procurement decisions.

Typical responsibilities include:

- reviewing future availability;
- reviewing system recommendations;
- applying business judgment;
- adjusting recommendations when justified;
- recording final procurement decisions and relevant observations.

The final terminology and authorization model may evolve as the business process is validated.

---

## 5. Core Capabilities

### 5.1 Product Catalog

Maintain the product information required for planning.

Relevant product concepts may include:

- product identity;
- description;
- lifecycle/status;
- equipment-series compatibility;
- purchasing or packaging information;
- planning-related attributes;
- observations.

Exact attributes and validation rules belong in the domain model and business rules.

### 5.2 Historical Sales

Import and retain the historical sales information required for analysis and planning.

The system should support sales information from the locations and business flows required by the validated planning process.

### 5.3 Operational Position Data

Import operational information used as planning input, including relevant product positions and location-specific quantities.

The system consumes this information for planning purposes.

It does not manage warehouse inventory transactions.

### 5.4 Inbound Supply

Represent incoming supply that materially affects future availability.

This may include relevant purchase orders, transit quantities, expected arrivals, or equivalent ERP-derived information.

Exact concepts and timing rules must be defined through validated domain rules.

### 5.5 Demand Analysis

Provide the historical and derived demand information required by the planning process.

The product may use averages, trends, seasonality, or other validated demand signals.

The specific formulas and weighting policies are business rules and are not defined by this PRD.

### 5.6 Availability Planning

Project expected product availability into future planning periods using validated source data and business rules.

The planning horizon should support multiple future periods rather than being structurally limited to a fixed number of months.

### 5.7 Purchase Recommendations

Generate procurement recommendations based on validated planning inputs and business rules.

Recommendations should be explainable and traceable to their relevant inputs and rules.

### 5.8 Human Decision Support

Authorized users should be able to review and, when appropriate, adjust system recommendations.

The system should preserve the distinction between:

- the system recommendation;
- the human adjustment;
- the final decision.

Relevant reasons or observations should be retained when required.

### 5.9 Reporting and Review

Provide views that help users understand:

- relevant source information;
- demand behavior;
- future availability;
- incoming supply;
- recommendations;
- adjustments;
- final decisions.

Reports should support decision-making rather than reproduce spreadsheet layouts unnecessarily.

---

## 6. Product Boundaries

`forecast_rta` is NOT intended to be:

- an ERP replacement;
- an inventory management system;
- a warehouse management system;
- a purchasing execution system;
- an accounting system;
- a real-time ERP synchronization platform.

The existing ERP remains the operational system of record for business transactions managed there.

`forecast_rta` consumes ERP-derived information and uses it for analysis, planning, recommendation, and decision support.

---

## 7. Decision-Support Principle

The system is responsible for producing reliable calculations, projections, and recommendations based on available information and validated business rules.

Authorized users remain responsible for final procurement decisions.

Expert judgment is considered a legitimate part of the business process.

When users adjust system-generated recommendations, the system should preserve sufficient information to explain:

- what the system recommended;
- what the user changed;
- what final decision was made;
- why the adjustment was made, when relevant.

The goal is not to eliminate human judgment, but to make the process faster, more consistent, and more traceable.

---

## 8. Data Sources

For the current product direction, operational data is primarily obtained from ERP-generated files.

Potential source categories include:

- product master data;
- historical sales;
- current product positions;
- inbound or transit information;
- other planning inputs validated during discovery.

The MVP does not require direct ERP integration.

External source formats are implementation concerns and must not define the business domain.

---

## 9. Planning Context

The business planning process may depend on more than historical demand.

Relevant factors may include:

- sales behavior;
- current available positions;
- incoming supply;
- product-specific constraints;
- operational lead times;
- seasonal or calendar constraints;
- expert judgment.

These factors must be captured as validated business rules before they determine production behavior.

This PRD intentionally does not define specific formulas, thresholds, lead times, or seasonal policies.

---

## 10. Success Outcomes

The product should demonstrate meaningful improvement in the current procurement-planning process.

Desired outcomes include:

- materially reducing the time required to prepare procurement analysis;
- reducing repeated manual calculation work;
- improving consistency and reproducibility of planning results;
- making recommendations easier to explain;
- preserving expert adjustments and their rationale;
- improving visibility of future availability;
- reducing dependency on knowledge held by a single individual.

Specific numeric targets should be added only when a reliable baseline and agreed business target exist.

---

## 11. MVP Direction

The MVP should prioritize the smallest coherent workflow that allows the business to move from ERP-derived source data to a useful procurement decision.

The expected high-level flow is:

1. maintain required product reference information;
2. import required ERP-derived planning data;
3. validate and normalize source information;
4. analyze relevant demand behavior;
5. calculate future availability;
6. generate an explainable purchase recommendation;
7. allow an authorized user to review and adjust the recommendation;
8. preserve the resulting decision and its traceability.

The MVP should avoid functionality that belongs to the ERP or that does not directly improve this decision workflow.

---

## 12. Out of Scope for the Current MVP

Unless later approved through product governance, the MVP does not include:

- direct ERP integration;
- real-time inventory synchronization;
- warehouse transaction management;
- stock transfers executed by the system;
- purchase-order execution;
- merchandise receiving;
- accounting or financial posting;
- autonomous procurement without human review;
- speculative logistics capabilities without validated business need.

---

## 13. Product Assumptions

The current product direction assumes that:

- the ERP remains available as the operational source of business data;
- required ERP information can be exported for use by `forecast_rta`;
- expert users will continue to participate in procurement decisions;
- not all existing spreadsheet behavior should automatically become product behavior;
- formulas and manual practices must be validated before being treated as canonical business rules.

Material assumptions that remain uncertain should be tracked in the domain open-questions documentation.

---

## 14. Open Product Questions

Product-level questions that materially affect scope should be tracked here only when they cannot be expressed as domain-specific open questions.

Current examples may include:

- Which planning capabilities are required for the first production MVP?
- Which outputs must be preserved for management review?
- Which responsibilities belong permanently to `forecast_rta` versus the ERP?

Domain-specific questions should be maintained in the canonical open-questions document rather than duplicated here.

---

## 15. Product Governance

This PRD defines product intent, scope, users, and high-level capabilities.

It does not define:

- architectural rules;
- implementation technology;
- database design;
- API contracts;
- detailed formulas;
- business-rule thresholds;
- implementation tasks.

Those concerns belong to their respective governance and implementation documents.

When business understanding changes:

- product-level scope changes should update this PRD;
- business-rule changes should update domain governance;
- architectural changes should update ADRs;
- feature behavior changes should update specifications.

The Constitution remains authoritative for engineering and governance principles.