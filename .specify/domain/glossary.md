# Domain Glossary — forecast_rta

**Status:** ACTIVE
**Created:** 2026-08-12
**Last Updated:** 2026-08-12

---

## Purpose

This document defines the canonical business terminology used by `forecast_rta`.

Business rules, domain models, specifications, plans, and implementation documentation SHOULD use these terms consistently.

---

## Product

### Product

A consumable or other item distributed by the business and considered in procurement and availability planning.

**Related terms:** Product Status, Minimum Quantity, Quantity per Box, Equipment Series

---

### Product Status

The commercial lifecycle state of a Product.

Product Status is separate from Minimum Quantity.

A Product MUST NOT be considered discontinued solely because its Minimum Quantity is zero.

**Related terms:** Product, Minimum Quantity

---

### Active Product

A Product that remains commercially available and relevant to normal business operations.

**Related terms:** Product Status

---

### Discontinued Product

A Product that is no longer intended for continued commercial replenishment.

Discontinued status is represented explicitly through Product Status rather than through Minimum Quantity.

**Avoid:** using `Minimum Quantity = 0` as a synonym for discontinued

---

### On-Demand Product

A very low-demand Product that is not normally maintained in stock.

When required by a customer, a specific order is placed for that demand and the customer is informed of the applicable delivery time.

**Original business term:** Bajo Pedido

**Related terms:** Product, Procurement Decision

---

### Equipment Series

A family or generation of equipment with which one or more Products may be compatible.

Known examples include S2, S3, S4, and S5.

A Product may be compatible with more than one Equipment Series.

**Related terms:** Product

---

## Product Quantities

### Minimum Quantity

The minimum quantity of a Product that the business intends to maintain in available stock to support expected customer demand.

It represents a planning requirement and does not represent Product Status.

**Related terms:** Available Stock, Product Status

---

### Quantity per Box

The number of individual product units or containers included in one supplier box.

Purchase orders to the manufacturer are placed in boxes rather than individual units.

Quantity per Box may differ by Product.

**Related terms:** Purchase Quantity, Box

---

### Box

The purchasing package used when ordering a Product from the manufacturer.

A Box contains the number of individual units defined by the Product's Quantity per Box.

**Related terms:** Quantity per Box

---

### Pallet

A logistics unit used to group boxes for storage and transportation.

Pallet utilization may influence purchasing and shipping decisions.

Exact pallet optimization rules are not currently part of the validated MVP domain.

**Related terms:** Box

---

## Locations

### Domestic

One of the Miami warehouse locations used by the business.

Its stock contributes to Miami Available Stock.

**Related terms:** Bonded, Miami Available Stock

---

### Bonded

One of the Miami warehouse locations used by the business.

Its stock contributes to Miami Available Stock.

**Related terms:** Domestic, Miami Available Stock

---

### Miami Available Stock

The stock considered available in Miami for planning purposes.

It consists of the combined stock held in:

- Domestic
- Bonded

**Related terms:** Domestic, Bonded, Available Stock

---

### Puerto Rico

A business location whose sales and inventory information may participate in availability planning.

Puerto Rico data remains distinguishable from Miami data even when a calculation uses information from both locations.

---

### Available Stock

The quantity considered available for a specific planning calculation.

Available Stock is context-dependent and SHOULD identify the location or locations included in the calculation.

**Related terms:** Miami Available Stock, Availability

---

## Demand

### Historical Sales

Recorded past sales used as an input for demand analysis and planning.

Historical Sales originate from operational business data rather than from forecast calculations.

---

### 12-Month Average

The average historical sales quantity calculated over the applicable previous twelve-month period.

It is the primary historical reference currently used by the planner when evaluating how much Product may need to be purchased.

**Related terms:** 6-Month Average, Demand Trend

---

### 6-Month Average

The average historical sales quantity calculated over the applicable previous six-month period.

It is used together with the 12-Month Average as an indicator of recent demand direction.

**Related terms:** 12-Month Average, Demand Trend

---

### Demand Trend

A planning indicator derived from comparing recent demand behavior with longer-term demand behavior.

Current business interpretation:

- 6-Month Average greater than 12-Month Average suggests increasing demand.
- 6-Month Average lower than 12-Month Average suggests decreasing demand.

The magnitude and operational consequence of the trend require separate business rules.

**Related terms:** 6-Month Average, 12-Month Average

---

### New Product Demand Reference

A manufacturer-provided recommendation used as an initial demand reference when a new Equipment Series or Product does not yet have sufficient historical sales data.

This reference supports initial procurement judgment until meaningful historical demand becomes available.

**Related terms:** Equipment Series, Historical Sales

---

## Planning

### Availability

A measure used to evaluate how much expected demand can be supported by available Product quantities.

Availability may be expressed in months.

The exact calculation MUST be defined by validated business rules rather than by this glossary.

**Related terms:** Available Stock, Historical Sales, Availability Planning

---

### Availability Planning

The process of evaluating current and expected future Product availability using relevant stock, demand, inbound supply, and business information.

Availability Planning supports procurement decisions but does not execute purchases.

---

### Planning Horizon

The future period over which Availability Planning is evaluated.

The system should support multiple future periods without structurally fixing the domain to a specific number of months.

---

### Planning Snapshot

A set of operational data associated with the date on which information was loaded for planning.

The load date does not necessarily represent a fixed monthly closing date.

**Related terms:** Source Data

---

### Inbound Supply

Product quantities expected to become available in a future planning period.

Inbound Supply may include merchandise already ordered or in transit.

Specific inclusion and timing rules require validated business rules.

---

## Procurement

### Purchase Recommendation

A quantity or purchasing indication generated by the system from validated planning information and business rules.

A Purchase Recommendation is not the final procurement decision.

**Related terms:** Procurement Decision, Human Adjustment

---

### Procurement Decision

The final purchasing decision made by the authorized business user.

The decision may consider system calculations, historical averages, trends, manufacturer guidance, logistics constraints, and expert judgment.

**Related terms:** Purchase Recommendation, Human Adjustment

---

### Human Adjustment

A deliberate change made by an authorized user to a system-generated recommendation or planning result when business judgment requires it.

Relevant adjustments should remain distinguishable and traceable.

---

### Purchase Quantity

The quantity selected for procurement.

Supplier orders are placed in Boxes rather than individual product units.

The final Purchase Quantity is currently determined by the responsible business user.

**Related terms:** Box, Quantity per Box, Procurement Decision

---

### Manufacturer Recommendation

Guidance supplied by the equipment manufacturer regarding an initial quantity or expected consumption requirement.

It is particularly relevant when a new Product or Equipment Series lacks sufficient Historical Sales.

---

### Minimum Order Quantity (MOQ)

The minimum quantity that a supplier requires in a purchase order.

Whether MOQ applies to the current procurement process has not yet been confirmed.

This term is included for shared vocabulary only and MUST NOT be treated as an active business rule until validated.

---

## External Data

### ERP

The existing operational system of record from which business data used by `forecast_rta` originates.

`forecast_rta` does not replace the ERP.

---

### ERP-Derived File

A file exported from the ERP and used as a source for planning data.

Its structure is an external representation and must not define the core domain model.

---

### Source Data

Information received from an authoritative external source before domain calculations or user adjustments are applied.

**Related terms:** ERP-Derived File, Planning Snapshot

---

## Expert Knowledge

### Planning Observation

A human-entered comment that captures business knowledge relevant to planning.

Examples from the current process include instructions such as maintaining a particular quantity of a Product.

Observations must not automatically be treated as unstructured noise.

---

### "Tener N"

A planning observation indicating that at least `N` units of a Product should be maintained in stock to satisfy expected customer demand.

Where validated, this knowledge should be represented through an explicit business concept such as Minimum Quantity rather than remaining only as free-text commentary.

**Related terms:** Minimum Quantity, Planning Observation

---

## Terminology Rules

1. Use `Product Status` to represent lifecycle state; do not encode discontinued status through Minimum Quantity.
2. Use `On-Demand Product` for the business concept currently called `Bajo Pedido`.
3. Keep location-specific stock distinguishable even when calculations consolidate locations.
4. Distinguish Purchase Recommendation from Procurement Decision.
5. Distinguish system-generated information from Human Adjustments.
6. Do not use `Inventory Management` to describe the responsibility of `forecast_rta`.
7. Do not use spreadsheet column names or workbook terminology as canonical domain concepts unless explicitly validated.
8. Terms with unresolved behavior may be defined for vocabulary purposes, but their unresolved aspects MUST remain in `open-questions.md`.