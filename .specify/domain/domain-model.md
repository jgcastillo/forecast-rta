# Domain Model — forecast_rta

**Status:** DRAFT
**Created:** 2026-08-12
**Last Updated:** 2026-08-12

---

## 1. Purpose

This document defines the current conceptual domain model for `forecast_rta`.

It describes business concepts, responsibilities, relationships, and invariants.

It does NOT define:

- database tables;
- SQLModel models;
- API schemas;
- persistence types;
- UI components;
- spreadsheet structures.

Only validated business knowledge is modeled as established behavior.

Unresolved behavior remains governed by `.specify/domain/open-questions.md`.

---

## 2. References

- Constitution: `.specify/memory/constitution.md`
- Product Requirements: `docs/prd.md`
- Glossary: `.specify/domain/glossary.md`
- Business Rules: `.specify/domain/business-rules.md`
- Open Questions: `.specify/domain/open-questions.md`

---

## 3. Domain Scope

The domain supports procurement and future availability decision-making.

### Included

- products;
- product lifecycle status;
- equipment-series compatibility;
- product purchasing units;
- minimum stock targets;
- historical sales;
- stock by business location;
- planning snapshots;
- demand indicators;
- inbound supply;
- availability planning;
- system recommendations;
- human procurement decisions;
- planning observations.

### Outside the Current Domain

- ERP transaction management;
- warehouse operations;
- accounting;
- purchase-order execution;
- merchandise receiving;
- real-time ERP synchronization;
- pallet optimization;
- container optimization;
- freight-capacity optimization.

The ERP remains the operational system of record.

---

## 4. Domain Overview

The current conceptual flow is:

`ERP-derived facts`
→ `Normalized planning information`
→ `Demand indicators`
→ `Availability planning`
→ `Decision-support information`
→ `Human procurement decision`

The system supports the planner's judgment.

It does not currently own the final determination of how much the business must purchase.

---

## 5. Product

### Product

A commercial item considered in availability and procurement planning.

A Product has an identity independent from its sales history, stock position, or lifecycle state.

### Responsibilities

A Product provides the planning context required to interpret:

- lifecycle status;
- equipment-series compatibility;
- Minimum Quantity;
- Quantity per Box;
- On-Demand behavior;
- observations relevant to planning.

### Governed by

- BR-001
- BR-002
- BR-004
- BR-005
- BR-007

---

## 6. Product Status

### Product Status

Represents the commercial lifecycle state of a Product.

Known conceptual states currently include:

- Active
- Discontinued

Additional states MUST NOT be introduced without validated business need.

### Invariant

Product Status is independent from Minimum Quantity.

A Minimum Quantity of zero does not imply that a Product is discontinued.

### Governed by

- BR-001
- BR-004

---

## 7. Equipment Series

### Equipment Series

Represents an equipment family or generation whose operation requires compatible Products.

Known examples include:

- S2
- S3
- S4
- S5

A Product may be compatible with one or more Equipment Series.

An Equipment Series may use multiple Products.

Conceptually:

`Product <-> Equipment Series`

is a many-to-many business relationship.

Combined labels such as `S23` or `S234` SHOULD be understood as compatibility with multiple individual Equipment Series rather than as separate permanent series concepts.

---

## 8. Product Purchasing Configuration

### Quantity per Box

Represents the number of individual Product units contained in one supplier Box.

Quantity per Box belongs to the Product's purchasing configuration.

### Box

Represents the supplier purchasing unit.

Supplier purchase orders are placed in whole Boxes.

### Governed by

- BR-006
- BR-007

### Unresolved

The exact conversion and rounding behavior between required Product units and whole Boxes is governed by:

- OQ-008

---

## 9. Minimum Quantity

### Minimum Quantity

Represents the Product quantity the business intends to maintain to support expected customer demand.

It is planning information associated with a Product.

Minimum Quantity does not represent Product Status.

### Governed by

- BR-002
- BR-003

### Unresolved

Whether Minimum Quantity behaves as:

- a hard constraint;
- a warning threshold;
- a planning target;

remains governed by:

- OQ-006

---

## 10. On-Demand Product

### On-Demand Product

Represents an active Product whose demand is sufficiently low that the business does not normally maintain stock for it.

A customer request triggers a specific procurement decision and the customer is informed of the expected delivery time.

On-Demand is a planning/commercial characteristic and MUST NOT be confused with Discontinued status.

### Governed by

- BR-005

### Unresolved

The canonical relationship between On-Demand status and Minimum Quantity remains governed by:

- OQ-007

---

## 11. Business Location

### Business Location

Represents a business-relevant physical location associated with stock or sales information.

Known locations currently include:

- Domestic
- Bonded
- Puerto Rico

Domestic and Bonded are Miami warehouse locations.

Location-specific information must remain distinguishable even when calculations consolidate multiple locations.

### Governed by

- BR-008
- BR-009

---

## 12. Stock Position

### Stock Position

Represents the observed quantity of a Product at a Business Location for a particular Planning Snapshot.

A Stock Position is an imported planning fact.

`forecast_rta` does not manage the warehouse transactions that produced it.

Conceptually, a Stock Position relates:

- one Product;
- one Business Location;
- one Planning Snapshot;
- one observed quantity.

---

## 13. Miami Available Stock

### Miami Available Stock

Represents the consolidated stock used for Miami planning.

Conceptually:

`Miami Available Stock = Domestic Stock + Bonded Stock`

Domestic and Bonded source positions remain independently traceable.

### Governed by

- BR-008
- BR-009

---

## 14. Historical Sale

### Historical Sale

Represents recorded past Product demand originating from operational business data.

A Historical Sale must preserve enough context to identify:

- Product;
- applicable business location or sales context;
- relevant business period/date;
- quantity.

Historical Sales are source facts, not calculated forecasts.

---

## 15. Demand Indicators

Demand indicators are derived planning values calculated from Historical Sales.

They support human analysis but do not independently determine the final Procurement Decision.

### 12-Month Average

Represents the applicable average historical sales quantity over twelve months.

It is the planner's primary historical demand reference.

### 6-Month Average

Represents the applicable average historical sales quantity over six months.

It provides a more recent demand reference.

### Demand Trend

Represents the directional signal obtained by comparing the 6-Month Average with the 12-Month Average.

Current interpretation:

- `6M > 12M` → increasing-demand signal;
- `6M < 12M` → decreasing-demand signal.

No automatic Purchase Quantity follows solely from this signal.

### Governed by

- BR-010
- BR-011
- BR-012
- BR-013
- BR-014

---

## 16. New Product Demand Reference

### New Product Demand Reference

Represents manufacturer guidance used when a new Product or Equipment Series does not yet have sufficient Historical Sales.

It provides an initial planning reference rather than historical demand.

### Governed by

- BR-015

### Unresolved

The transition from manufacturer guidance to history-based planning is governed by:

- OQ-005

---

## 17. Planning Snapshot

### Planning Snapshot

Represents a coherent set of operational information available for planning at a particular point in time.

It may contain or reference:

- Stock Positions;
- source-data dates;
- import/load date;
- Inbound Supply;
- other validated operational inputs.

The current Excel load date must not automatically be interpreted as a fixed monthly closing date.

### Governed by

- BR-018

### Unresolved

The exact distinction between source business date and import timestamp is governed by:

- OQ-012

---

## 18. Inbound Supply

### Inbound Supply

Represents Product quantities expected to become available in a future planning period.

Inbound Supply may originate from merchandise already ordered or in transit.

At minimum it must remain associated with:

- Product;
- expected quantity;
- relevant expected period or arrival information.

Exact inclusion rules in future availability calculations remain unresolved.

---

## 19. Availability

### Availability

Represents the relationship between Product quantities available for planning and expected demand.

Availability may be expressed in months.

Availability is a derived value rather than an independent source fact.

### Unresolved

The canonical calculation remains governed by:

- OQ-003
- OQ-004

No implementation should infer the final formula from historical Excel behavior alone.

---

## 20. Availability Planning

### Availability Planning

Represents the process of evaluating a Product's expected availability across current and future planning periods.

Potential inputs include:

- Stock Positions;
- Historical Sales;
- Demand Indicators;
- Minimum Quantity;
- Inbound Supply;
- New Product Demand Reference;
- validated planning policies.

Availability Planning produces decision-support information.

It does not execute procurement.

### Unresolved

The period-to-period state transition is governed by:

- OQ-002

---

## 21. Planning Period

### Planning Period

Represents one future interval within the Planning Horizon.

The exact calendar representation is a technical concern unless business validation establishes additional semantics.

---

## 22. Planning Horizon

### Planning Horizon

Represents the collection of future Planning Periods evaluated during Availability Planning.

The domain MUST NOT assume a permanently fixed number of future months.

The exact MVP horizon may be configured once validated.

---

## 23. Purchase Recommendation

### Purchase Recommendation

Represents a system-generated purchasing indication based on validated domain rules and available planning information.

A Purchase Recommendation is not a Procurement Decision.

The MVP MAY provide indicators without generating a definitive quantity recommendation until sufficient rules are validated.

---

## 24. Procurement Decision

### Procurement Decision

Represents the purchasing decision made by the responsible business user.

The planner may consider:

- 12-Month Average;
- 6-Month Average;
- Demand Trend;
- available stock;
- Minimum Quantity;
- Inbound Supply;
- manufacturer guidance;
- logistics considerations;
- expert judgment.

The final Purchase Quantity remains a human decision under the currently validated domain.

### Governed by

- BR-016
- BR-017

---

## 25. Purchase Quantity

### Purchase Quantity

Represents the quantity selected by the planner for procurement.

The supplier transaction is ultimately expressed in Boxes.

The relationship between a planner's quantity requirement and the final number of Boxes still requires a validated rounding policy.

### Governed by

- BR-006
- BR-016

### Unresolved

- OQ-001
- OQ-008

---

## 26. Human Adjustment

### Human Adjustment

Represents a deliberate change or judgment applied by an authorized planner to system-generated planning information or recommendations.

A Human Adjustment should preserve enough context to distinguish:

- original system output;
- adjustment;
- resulting decision;
- responsible user;
- reason when applicable.

A Human Adjustment does not modify the historical source facts from which the system calculated its result.

### Governed by

- BR-017

---

## 27. Planning Observation

### Planning Observation

Represents expert business knowledge entered as human-readable information relevant to Product planning.

Some observations may later become structured domain information when their meaning is validated.

Example:

`Tener 50`

has been validated as Minimum Quantity knowledge rather than merely free-text commentary.

### Governed by

- BR-003

---

## 28. External Source

### ERP

The ERP remains the operational system of record.

### ERP-Derived File

Represents an exported external dataset consumed by `forecast_rta`.

ERP-specific structures belong at the system boundary and are not domain concepts beyond their role as information sources.

### Unresolved

Mapping of actual ERP files to normalized domain concepts is governed by:

- OQ-013

---

## 29. Core Relationships

The current conceptual relationships are:

- Product has one Product Status.
- Product has a Minimum Quantity.
- Product has a Quantity per Box.
- Product may be On-Demand.
- Product is compatible with one or more Equipment Series.
- Product has many Historical Sales.
- Product may have Stock Positions at multiple Business Locations.
- Stock Position belongs to a Planning Snapshot.
- Product may have Inbound Supply.
- Historical Sales produce Demand Indicators.
- Demand Indicators support Availability Planning.
- Availability Planning evaluates Products across a Planning Horizon.
- Availability Planning may produce a Purchase Recommendation.
- Planner creates a Procurement Decision.
- Procurement Decision may differ from Purchase Recommendation.
- Procurement Decision contains or determines Purchase Quantity.
- Product may have Planning Observations.

---

## 30. System vs Human Responsibility

| Responsibility | System | Human |
|---|---|---|
| Import and normalize source data | Yes | Reviews/errors |
| Maintain historical information | Yes | Reviews |
| Calculate 12-Month Average | Yes | Uses result |
| Calculate 6-Month Average | Yes | Uses result |
| Identify demand trend signal | Yes | Interprets result |
| Maintain location-specific stock | Yes | Reviews |
| Calculate validated availability | Yes | Uses result |
| Project future availability | Yes, once rules are validated | Reviews |
| Generate purchase recommendation | Potentially | Reviews |
| Determine final Purchase Quantity | No | Yes |
| Apply expert judgment | No | Yes |
| Execute supplier purchase order | No | External process / Human |
| Optimize pallet/container utilization | No in MVP | Yes |

---

## 31. Domain Invariants

### INV-001 — Product Status Independence

Product Status MUST NOT be inferred from Minimum Quantity.

**Source:** BR-001

---

### INV-002 — Source Stock Traceability

Domestic, Bonded, and Puerto Rico Stock Positions MUST remain distinguishable even when planning calculations consolidate them.

**Source:** BR-009

---

### INV-003 — Recommendation / Decision Separation

A system-generated Purchase Recommendation MUST NOT silently become or overwrite the final Procurement Decision.

**Source:** BR-017

---

### INV-004 — Source Facts Are Not Human Adjustments

Historical Sales, Stock Positions, and other imported source facts MUST remain distinguishable from Human Adjustments.

---

### INV-005 — Demand Trend Is Advisory

Demand Trend MUST NOT independently determine final Purchase Quantity.

**Source:** BR-014

---

### INV-006 — Procurement Is Box-Based

Supplier purchasing is expressed in whole Boxes.

The exact rounding rule remains unresolved.

**Source:** BR-006

---

### INV-007 — ERP Ownership

`forecast_rta` MUST NOT become the authoritative owner of ERP-managed operational transactions through the planning domain.

---

## 32. Explicitly Deferred Concepts

The following concepts are acknowledged but intentionally not modeled as core MVP behavior:

### Minimum Order Quantity

Exists as domain vocabulary but applicability is unresolved.

Reference:

- OQ-001

### Pallet Optimization

May influence human Procurement Decisions but is outside the current MVP.

Reference:

- BR-019
- OQ-009

### Freight / Container Capacity

Relevant logistics context but not currently deterministic enough for automated planning.

Reference:

- OQ-010

### Seasonal Procurement Policies

Potential future procurement policies that require further validation.

Reference:

- OQ-011

---

## 33. Open Domain Questions

The following questions materially affect future domain evolution:

- OQ-001 — supplier MOQ;
- OQ-002 — month-to-month availability projection;
- OQ-003 — demand basis for availability;
- OQ-004 — Puerto Rico participation in availability;
- OQ-005 — transition from manufacturer guidance to historical demand;
- OQ-006 — Minimum Quantity enforcement;
- OQ-007 — On-Demand relationship with Minimum Quantity;
- OQ-008 — Box rounding;
- OQ-009 — pallet role;
- OQ-010 — logistics constraints;
- OQ-011 — seasonal procurement timing;
- OQ-012 — source date versus load date;
- OQ-013 — ERP source-file mapping.

Blocking questions prevent only the features whose behavior depends on them.

---

## 34. Approval Check

Before changing this document to `APPROVED`:

- [ ] Product terminology matches the glossary.
- [ ] All modeled business behavior references validated rules where applicable.
- [ ] Product Status and Minimum Quantity remain separate.
- [ ] Equipment Series compatibility is represented independently rather than through combined labels.
- [ ] Stock remains location-specific.
- [ ] Demand indicators remain distinct from procurement decisions.
- [ ] Human decisions remain distinct from system recommendations.
- [ ] External ERP ownership remains explicit.
- [ ] No persistence or framework detail has been introduced.
- [ ] Unresolved behavior remains represented as open questions.
- [ ] No pallet or logistics optimization has entered MVP behavior implicitly.

---

## 35. Approval

**Status:** DRAFT

**Approved By:** N/A

**Approval Date:** N/A

---

## Model Rules

1. This model describes business meaning, not persistence.
2. New concepts require a validated business need.
3. Open questions must not be resolved through model assumptions.
4. Supporting indicators must not be confused with final human decisions.
5. External-system facts must remain distinguishable from calculated and manually adjusted information.
6. Persistence design must follow this model where applicable, not redefine it.