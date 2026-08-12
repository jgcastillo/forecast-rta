# Business Rules — forecast_rta

**Status:** ACTIVE
**Created:** 2026-08-12
**Last Updated:** 2026-08-12

---

## Purpose

This document is the canonical source for validated business rules used by `forecast_rta`.

Feature specifications SHOULD reference these rule identifiers instead of redefining them.

Rules marked `VALIDATED` may govern production behavior.

Rules marked `HYPOTHESIS` are not implementation authority.

---

## Product Rules

### BR-001 — Product Status Is Independent from Minimum Quantity

**Status:** VALIDATED

**Rule:**  
A Product's lifecycle status MUST be represented independently from its Minimum Quantity.

A Product MUST NOT be classified as discontinued solely because its Minimum Quantity is zero.

**Applies to:**  
Product, Product Status, Minimum Quantity

**Source:**  
Client confirmation.

---

### BR-002 — Minimum Quantity Represents Desired Stock Floor

**Status:** VALIDATED

**Rule:**  
Minimum Quantity represents the minimum quantity of a Product that the business intends to maintain in stock to support expected customer demand.

**Applies to:**  
Product, Minimum Quantity, Availability Planning

**Source:**  
Client confirmation.

---

### BR-003 — "Tener N" Represents Minimum Quantity Knowledge

**Status:** VALIDATED

**Rule:**  
A planning observation such as `Tener 50` means that the planner intends to maintain at least 50 units of that Product in stock.

Where this information is validated, it SHOULD be represented through an explicit planning attribute such as Minimum Quantity rather than only as free text.

**Applies to:**  
Minimum Quantity, Planning Observation

**Source:**  
Client confirmation and current Excel process.

---

### BR-004 — Discontinued Products Use Explicit Status

**Status:** VALIDATED

**Rule:**  
Products that are no longer intended for continued commercial replenishment MUST be represented using Product Status rather than through a special Minimum Quantity value.

**Applies to:**  
Product Status, Product

**Source:**  
Client confirmation.

---

## On-Demand Product Rules

### BR-005 — On-Demand Products Are Not Normally Stocked

**Status:** VALIDATED

**Rule:**  
An On-Demand Product is a low-demand Product that is not normally maintained in stock.

When a customer requires the Product, a specific procurement action is taken for that customer and the expected delivery time is communicated.

**Applies to:**  
On-Demand Product, Procurement Decision

**Source:**  
Client confirmation.

---

## Purchasing Unit Rules

### BR-006 — Supplier Orders Are Placed in Boxes

**Status:** VALIDATED

**Rule:**  
Purchase orders to the manufacturer are placed in whole Boxes rather than individual product units.

**Applies to:**  
Box, Purchase Quantity, Procurement Decision

**Source:**  
Client confirmation.

---

### BR-007 — Quantity per Box Is Product-Specific

**Status:** VALIDATED

**Rule:**  
Each Product has a Quantity per Box that defines how many individual units or containers are included in one supplier Box.

Quantity per Box may vary by Product.

**Applies to:**  
Product, Quantity per Box, Box

**Source:**  
Client confirmation.

---

## Location and Stock Rules

### BR-008 — Miami Available Stock Includes Domestic and Bonded

**Status:** VALIDATED

**Rule:**  
For Miami planning purposes, available stock is the sum of stock held in the Domestic and Bonded warehouse locations.

Conceptually:

`Miami Available Stock = Domestic Stock + Bonded Stock`

**Applies to:**  
Domestic, Bonded, Miami Available Stock

**Source:**  
Client confirmation.

---

### BR-009 — Location-Specific Stock Must Remain Distinguishable

**Status:** VALIDATED

**Rule:**  
Domestic, Bonded, and Puerto Rico stock quantities MUST remain distinguishable in source and planning data even when a calculation uses consolidated values.

**Applies to:**  
Domestic, Bonded, Puerto Rico, Available Stock

**Source:**  
Client confirmation and planning requirements.

---

## Historical Demand Rules

### BR-010 — Twelve-Month Average Is the Primary Historical Reference

**Status:** VALIDATED

**Rule:**  
The 12-Month Average is the planner's primary historical sales reference when evaluating future purchasing needs.

It supports the planner's judgment but does not automatically determine the final Purchase Quantity.

**Applies to:**  
12-Month Average, Procurement Decision

**Source:**  
Client confirmation.

---

### BR-011 — Six-Month Average Is Used as a Recent Demand Indicator

**Status:** VALIDATED

**Rule:**  
The 6-Month Average is used together with the 12-Month Average to evaluate recent demand direction.

**Applies to:**  
6-Month Average, 12-Month Average, Demand Trend

**Source:**  
Client confirmation.

---

### BR-012 — Increasing Trend Signal

**Status:** VALIDATED

**Rule:**  
When the 6-Month Average is greater than the 12-Month Average, the planner interprets this as a signal that demand is increasing.

**Applies to:**  
Demand Trend, 6-Month Average, 12-Month Average

**Source:**  
Client confirmation.

---

### BR-013 — Decreasing Trend Signal

**Status:** VALIDATED

**Rule:**  
When the 6-Month Average is lower than the 12-Month Average, the planner interprets this as a signal that demand is decreasing.

**Applies to:**  
Demand Trend, 6-Month Average, 12-Month Average

**Source:**  
Client confirmation.

---

### BR-014 — Trend Is Decision Support, Not Automatic Purchase Logic

**Status:** VALIDATED

**Rule:**  
Demand Trend is an input to human procurement judgment.

The system MUST NOT derive the final Purchase Quantity solely from the comparison between the 6-Month Average and the 12-Month Average unless a future validated rule explicitly defines that behavior.

**Applies to:**  
Demand Trend, Procurement Decision

**Source:**  
Client confirmation.

---

## New Product Rules

### BR-015 — New Products Use Manufacturer Guidance Initially

**Status:** VALIDATED

**Rule:**  
When a new Equipment Series or Product does not yet have sufficient historical sales data, the initial procurement quantity is determined using recommendations provided by the manufacturer.

**Applies to:**  
New Product Demand Reference, Manufacturer Recommendation, Equipment Series

**Source:**  
Client confirmation.

---

## Procurement Decision Rules

### BR-016 — Final Purchase Quantity Is a Human Decision

**Status:** VALIDATED

**Rule:**  
The final quantity to request from the manufacturer is determined by the responsible planner.

System calculations, averages, trends, stock information, inbound supply, and other validated indicators support this decision but do not replace it.

**Applies to:**  
Procurement Decision, Purchase Quantity, Purchase Recommendation

**Source:**  
Client confirmation.

---

### BR-017 — System Outputs Must Remain Distinct from Human Decisions

**Status:** VALIDATED

**Rule:**  
Any system-generated recommendation or calculated planning result MUST remain distinguishable from the final Procurement Decision made by the planner.

**Applies to:**  
Purchase Recommendation, Procurement Decision, Human Adjustment

**Source:**  
Validated product direction and client workflow.

---

## Planning Snapshot Rules

### BR-018 — Import Date Is Not Necessarily a Fixed Period Closing Date

**Status:** VALIDATED

**Rule:**  
The date currently associated with planning data represents when data was loaded into the working process and is not assumed to be a fixed monthly closing date.

The system MUST NOT infer a fixed monthly closing cycle from that date alone.

**Applies to:**  
Planning Snapshot, Source Data

**Source:**  
Client confirmation.

---

## Pallet and Logistics Rules

### BR-019 — Pallet Optimization Is Outside the Current MVP

**Status:** VALIDATED

**Rule:**  
Pallet optimization, container-capacity optimization, and equivalent logistics-space decisions are outside the current MVP.

These decisions remain human until sufficient structured logistics data and repeatable rules are available.

**Applies to:**  
Pallet, Procurement Decision, Logistics Planning

**Source:**  
Client discussion.

---

## Explicitly Unresolved Areas

The following topics are NOT yet validated business rules and MUST remain governed by `.specify/domain/open-questions.md`:

- exact month-to-month availability projection;
- exact demand denominator used for availability in months;
- exact role of Puerto Rico in availability calculations;
- MOQ applicability;
- rounding policy from units to whole Boxes;
- transition from manufacturer guidance to historical-sales planning;
- whether Minimum Quantity is a hard constraint or a planning target;
- pallet optimization;
- detailed seasonal procurement policies;
- exact ERP file mapping.

---

## Rules

1. Only `VALIDATED` rules may govern approved feature behavior.
2. Do not infer additional rules from Excel formulas, comments, or historical implementation.
3. Feature specifications SHOULD reference BR identifiers instead of duplicating rule text.
4. When a validated rule changes materially, supersede it rather than silently changing its historical meaning.
5. Unresolved business behavior belongs in `open-questions.md`.
6. This document defines business behavior, not technical implementation.