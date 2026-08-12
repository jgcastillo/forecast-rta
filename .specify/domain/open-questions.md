# Open Questions — forecast_rta

**Status:** ACTIVE
**Created:** 2026-08-12
**Last Updated:** 2026-08-12

---

## Purpose

This document tracks unresolved business questions that may affect domain rules, specifications, planning behavior, or implementation.

Unresolved questions MUST NOT be converted into assumptions or production behavior.

---

## Questions

### OQ-001 — Does the supplier enforce a Minimum Order Quantity (MOQ)?

**Status:** OPEN

**Why it matters:**  
MOQ may affect the minimum quantity that can be ordered and could alter the final procurement decision.

**Related to:**  
Minimum Order Quantity, Purchase Quantity, Procurement Decision

**Current hypothesis:**  
Unknown.

**Source:**  
Client discussion.

### Resolution

**Answer:**  
PENDING

**Resulting change:**  
PENDING

---

### OQ-002 — What is the exact month-to-month availability projection formula?

**Status:** BLOCKING

**Why it matters:**  
The MVP can display current indicators without this rule, but reliable multi-period availability projection cannot be automated until the transition from one planning period to the next is validated.

**Related to:**  
Availability Planning, Planning Horizon, Inbound Supply, Historical Sales

**Current hypothesis:**  
A future-period stock position appears to depend on prior-period stock, expected demand, and applicable inbound quantities, but the exact sequence and inclusion rules are not yet validated.

**Source:**  
Client discussion and current Excel process.

### Resolution

**Answer:**  
PENDING

**Resulting change:**  
PENDING

---

### OQ-003 — Which demand value should be used when calculating availability in months?

**Status:** BLOCKING

**Why it matters:**  
The client uses both 12-month and 6-month averages, but the canonical denominator for availability calculations has not yet been fully confirmed.

**Related to:**  
Availability, 12-Month Average, 6-Month Average, Demand Trend

**Current hypothesis:**  
The 12-month average is the primary planning reference, while the 6-month average is mainly used to identify trend.

**Source:**  
Client discussion.

### Resolution

**Answer:**  
PENDING

**Resulting change:**  
PENDING

---

### OQ-004 — How exactly is Puerto Rico included in the availability calculation?

**Status:** BLOCKING

**Why it matters:**  
The client confirmed that Puerto Rico participates in availability planning, but the exact relationship between Miami stock, Puerto Rico stock, Miami sales, and Puerto Rico sales still requires precise validation.

**Related to:**  
Miami Available Stock, Puerto Rico, Availability

**Current hypothesis:**  
Miami Domestic and Bonded stock are consolidated for Miami availability, while Puerto Rico demand also influences the months-of-availability calculation.

**Source:**  
Client discussion.

### Resolution

**Answer:**  
PENDING

**Resulting change:**  
PENDING

---

### OQ-005 — How should products with a new Equipment Series be planned after the initial manufacturer recommendation?

**Status:** OPEN

**Why it matters:**  
New products do not initially have sufficient historical sales. The point at which planning should transition from manufacturer guidance to historical demand is not defined.

**Related to:**  
New Product Demand Reference, Manufacturer Recommendation, Historical Sales

**Current hypothesis:**  
Manufacturer guidance is used initially and historical sales become more relevant as sufficient demand history accumulates.

**Source:**  
Client discussion.

### Resolution

**Answer:**  
PENDING

**Resulting change:**  
PENDING

---

### OQ-006 — Is Minimum Quantity always a hard minimum or sometimes only a planning guideline?

**Status:** OPEN

**Why it matters:**  
The system needs to know whether falling below Minimum Quantity represents a rule violation, a warning, or only contextual information for the planner.

**Related to:**  
Minimum Quantity, Procurement Decision, Planning Observation

**Current hypothesis:**  
It currently appears to be a planning target used by the responsible planner rather than an automatic purchasing constraint.

**Source:**  
Client discussion.

### Resolution

**Answer:**  
PENDING

**Resulting change:**  
PENDING

---

### OQ-007 — Should On-Demand Products have a Minimum Quantity of zero?

**Status:** OPEN

**Why it matters:**  
On-Demand Products are intentionally not normally stocked, so their relationship with Minimum Quantity should be explicit rather than inferred.

**Related to:**  
On-Demand Product, Minimum Quantity

**Current hypothesis:**  
An On-Demand Product may legitimately have a Minimum Quantity of zero while remaining active.

**Source:**  
Client discussion.

### Resolution

**Answer:**  
PENDING

**Resulting change:**  
PENDING

---

### OQ-008 — How should Purchase Quantity be rounded according to Quantity per Box?

**Status:** OPEN

**Why it matters:**  
Supplier orders are placed in whole boxes, while planning quantities may be expressed in individual product units.

**Related to:**  
Quantity per Box, Box, Purchase Quantity

**Current hypothesis:**  
A procurement decision expressed in individual units likely needs to be converted to whole boxes, but the rounding policy has not yet been explicitly validated.

**Source:**  
Client discussion.

### Resolution

**Answer:**  
PENDING

**Resulting change:**  
PENDING

---

### OQ-009 — What role should pallets play in procurement planning?

**Status:** OPEN

**Why it matters:**  
Pallet utilization can affect freight and storage economics, but the current process depends on contextual decisions and incomplete logistics data.

**Related to:**  
Pallet, Box, Purchase Quantity, Procurement Decision

**Current hypothesis:**  
Pallet optimization should remain outside the MVP until box dimensions, pallet capacities, transport capacities, and relevant logistics costs are available.

**Source:**  
Client discussion.

### Resolution

**Answer:**  
PENDING

**Resulting change:**  
PENDING

---

### OQ-010 — Which logistics constraints should eventually be modeled explicitly?

**Status:** OPEN

**Why it matters:**  
Shipping and storage decisions may be affected by available warehouse space, air capacity, sea-container capacity, seasonal conditions, and freight economics.

**Related to:**  
Pallet, Inbound Supply, Procurement Decision

**Current hypothesis:**  
These constraints should remain human decision factors during the MVP unless reliable data and repeatable rules become available.

**Source:**  
Client discussion.

### Resolution

**Answer:**  
PENDING

**Resulting change:**  
PENDING

---

### OQ-011 — How should seasonal operating constraints affect procurement timing?

**Status:** OPEN

**Why it matters:**  
The client has described periods where freight or arrival timing may be intentionally adjusted due to refrigeration needs, holidays, or storage costs.

**Related to:**  
Inbound Supply, Procurement Decision, Planning Horizon

**Current hypothesis:**  
Seasonal timing should be modeled separately from demand forecasting and may later become a procurement-planning policy.

**Source:**  
Prior client discovery.

### Resolution

**Answer:**  
PENDING

**Resulting change:**  
PENDING

---

### OQ-012 — What exactly does the date associated with imported ERP data represent?

**Status:** OPEN

**Why it matters:**  
The client indicated that dates in the current Excel workbook correspond to when data is loaded, but this may differ from transaction date, reporting date, or inventory snapshot date.

**Related to:**  
Planning Snapshot, ERP-Derived File, Source Data

**Current hypothesis:**  
The system should preserve both the source-data business date, when available, and the import/load timestamp rather than treating them as the same concept.

**Source:**  
Client discussion.

### Resolution

**Answer:**  
PENDING

**Resulting change:**  
PENDING

---

### OQ-013 — Which ERP-derived files provide each planning input?

**Status:** OPEN

**Why it matters:**  
The import model cannot be finalized until the source files are received and mapped to products, sales, stock, transit, and other planning inputs.

**Related to:**  
ERP-Derived File, Source Data, Planning Snapshot

**Current hypothesis:**  
Multiple ERP exports may need to be normalized and combined before entering the planning domain.

**Source:**  
Pending ERP files from client.

### Resolution

**Answer:**  
PENDING

**Resulting change:**  
PENDING

---

## Current Blocking Questions

The following questions currently block specific future automation:

- `OQ-002` — exact month-to-month projection formula;
- `OQ-003` — demand basis for availability;
- `OQ-004` — exact Puerto Rico participation in availability.

They do NOT block:

- product/catalog refinement;
- ERP file analysis;
- historical-sales ingestion;
- calculation and display of validated 12-month and 6-month averages;
- trend indication;
- basic planning workspace development once separately specified.

---

## Rules

1. One identifier represents one unresolved question.
2. `BLOCKING` applies only when the missing answer prevents a specific approval or implementation.
3. A current hypothesis is context, not a validated rule.
4. When a question is resolved, update the applicable canonical domain document and reference the resulting change here.
5. Keep resolved questions for traceability.
6. Do not move pallet or logistics optimization into MVP scope without validated data and repeatable rules.